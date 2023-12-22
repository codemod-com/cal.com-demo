import OldPage from "@pages/[user]/[type]";
import { ssrInit } from "app/_trpc/ssrInit";
import { _generateMetadata } from "app/_utils";
import { type GetServerSidePropsContext } from "next";
import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { headers, cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import type { GetBookingType } from "@calcom/features/bookings/lib/get-booking";
import { getBookingForReschedule, getBookingForSeatedEvent } from "@calcom/features/bookings/lib/get-booking";
import { orgDomainConfig, userOrgQuery } from "@calcom/features/ee/organizations/lib/orgDomains";
import { getUsernameList } from "@calcom/lib/defaultEvents";
import slugify from "@calcom/lib/slugify";
import prisma from "@calcom/prisma";
import { RedirectType } from "@calcom/prisma/client";
import { trpc } from "@calcom/trpc";

import { buildLegacyCtx } from "@lib/buildLegacyCtx";
import { getTemporaryOrgRedirect } from "@lib/getTemporaryOrgRedirect";

import PageWrapper from "@components/PageWrapperAppDir";

export const generateMetadata = async ({ params }: { params: Record<string, string | string[]> }) => {
  const context = buildLegacyCtx(headers(), cookies(), params);
  // @ts-expect-error `req` of type '{ headers: ReadonlyHeaders; cookies: ReadonlyRequestCookies; }' is not assignable to `req` in `GetServerSidePropsContext`
  const session = await getServerSession(context);
  const ssr = await ssrInit();

  const { rescheduleUid, bookingUid } = context.query;
  const { user: usernames, type: slug } = paramsSchema.parse(context.params);
  // @ts-expect-error `req` of type '{ headers: ReadonlyHeaders; cookies: ReadonlyRequestCookies; }' is not assignable to `req` in `GetServerSidePropsContext`
  const { currentOrgDomain, isValidOrgDomain } = orgDomainConfig(context.req, context.params?.orgSlug);
  const org = isValidOrgDomain ? currentOrgDomain : null;
  const eventData = await ssr.viewer.public.event.fetch({
    username: usernames.join("+"),
    eventSlug: slug,
    org,
  });
  const username = usernames[0];
  const { data: event } = trpc.viewer.public.event.useQuery(
    { username, eventSlug: slug, isTeamEvent: false, org: eventData?.entity.orgSlug ?? null },
    { refetchOnWindowFocus: false }
  );
  let booking: GetBookingType | null = null;
  if (rescheduleUid) {
    booking = await getBookingForReschedule(`${rescheduleUid}`, session?.user?.id);
  } else if (bookingUid) {
    booking = await getBookingForSeatedEvent(`${bookingUid}`);
  }

  const profileName = event?.profile?.name ?? "";
  const title = event?.title ?? "";

  return await _generateMetadata(
    (t) => `${rescheduleUid && !!booking ? t("reschedule") : ""} ${title} | ${profileName}`,
    (t) => `${rescheduleUid ? t("reschedule") : ""} ${title}`
  );
};

const paramsSchema = z.object({
  type: z.string().transform((s) => slugify(s)),
  user: z.string().transform((s) => getUsernameList(s)),
});

async function getDynamicGroupPageProps(context: Omit<GetServerSidePropsContext, "res" | "resolvedUrl">) {
  const session = await getServerSession(context);
  const { user: usernames, type: slug } = paramsSchema.parse(context.params);
  const { rescheduleUid, bookingUid } = context.query;

  const ssr = await ssrInit();
  const { currentOrgDomain, isValidOrgDomain } = orgDomainConfig(context.req, context.params?.orgSlug);

  const users = await prisma.user.findMany({
    where: {
      username: {
        in: usernames,
      },
      organization: isValidOrgDomain
        ? {
            slug: currentOrgDomain,
          }
        : null,
    },
    select: {
      allowDynamicBooking: true,
    },
  });

  if (!users.length) {
    return notFound();
  }
  const org = isValidOrgDomain ? currentOrgDomain : null;

  let booking: GetBookingType | null = null;
  if (rescheduleUid) {
    booking = await getBookingForReschedule(`${rescheduleUid}`, session?.user?.id);
  } else if (bookingUid) {
    booking = await getBookingForSeatedEvent(`${bookingUid}`);
  }

  // We use this to both prefetch the query on the server,
  // as well as to check if the event exist, so we c an show a 404 otherwise.
  const eventData = await ssr.viewer.public.event.fetch({
    username: usernames.join("+"),
    eventSlug: slug,
    org,
  });

  if (!eventData) {
    return notFound();
  }

  return {
    eventData: {
      entity: eventData.entity,
      length: eventData.length,
      metadata: {
        ...eventData.metadata,
        multipleDuration: [15, 30, 60],
      },
    },
    booking,
    user: usernames.join("+"),
    slug,
    away: false,
    trpcState: await ssr.dehydrate(),
    isBrandingHidden: false,
    isSEOIndexable: true,
    themeBasis: null,
    bookingUid: bookingUid ? `${bookingUid}` : null,
    rescheduleUid: rescheduleUid ? `${rescheduleUid}` : null,
  };
}

async function getUserPageProps(context: Omit<GetServerSidePropsContext, "res" | "resolvedUrl">) {
  const session = await getServerSession(context);
  const { user: usernames, type: slug } = paramsSchema.parse(context.params);
  const username = usernames[0];
  const { rescheduleUid, bookingUid } = context.query;
  const { currentOrgDomain, isValidOrgDomain } = orgDomainConfig(context.req, context.params?.orgSlug);

  const isOrgContext = currentOrgDomain && isValidOrgDomain;

  if (!isOrgContext) {
    const redirectObj = await getTemporaryOrgRedirect({
      slug: usernames[0],
      redirectType: RedirectType.User,
      eventTypeSlug: slug,
      currentQuery: context.query,
    });

    if (redirectObj) {
      return redirect(redirectObj.redirect.destination);
    }
  }

  const ssr = await ssrInit();
  const user = await prisma.user.findFirst({
    where: {
      username,
      organization: userOrgQuery(context.req, context.params?.orgSlug),
    },
    select: {
      away: true,
      hideBranding: true,
      allowSEOIndexing: true,
    },
  });

  if (!user) {
    return notFound();
  }

  let booking: GetBookingType | null = null;
  if (rescheduleUid) {
    booking = await getBookingForReschedule(`${rescheduleUid}`, session?.user?.id);
  } else if (bookingUid) {
    booking = await getBookingForSeatedEvent(`${bookingUid}`);
  }

  const org = isValidOrgDomain ? currentOrgDomain : null;
  // We use this to both prefetch the query on the server,
  // as well as to check if the event exist, so we can show a 404 otherwise.
  const eventData = await ssr.viewer.public.event.fetch({
    username,
    eventSlug: slug,
    org,
  });

  if (!eventData) {
    return notFound();
  }

  return {
    booking,
    eventData: {
      entity: eventData.entity,
      length: eventData.length,
      metadata: eventData.metadata,
    },
    away: user?.away,
    user: username,
    slug,
    trpcState: await ssr.dehydrate(),
    isBrandingHidden: user?.hideBranding,
    isSEOIndexable: user?.allowSEOIndexing,
    themeBasis: username,
    bookingUid: bookingUid ? `${bookingUid}` : null,
    rescheduleUid: rescheduleUid ? `${rescheduleUid}` : null,
  };
}

const getPageProps = async (context: Omit<GetServerSidePropsContext, "res" | "resolvedUrl">) => {
  const { user } = paramsSchema.parse(context.params);
  const isDynamicGroup = user.length > 1;

  return isDynamicGroup ? await getDynamicGroupPageProps(context) : await getUserPageProps(context);
};

type PageProps = Readonly<{
  params: Params;
}>;

const Page = async ({ params }: PageProps) => {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  const legacyCtx = buildLegacyCtx(headers(), cookies(), params);
  // @ts-expect-error `req` of type '{ headers: ReadonlyHeaders; cookies: ReadonlyRequestCookies; }' is not assignable to `req` in `GetServerSidePropsContext`
  const props = await getPageProps(legacyCtx);

  return (
    <PageWrapper
      getLayout={null}
      requiresLicense={false}
      nonce={nonce}
      themeBasis={null}
      dehydratedState={props.trpcState}>
      <OldPage {...props} />
    </PageWrapper>
  );
};

export default Page;
