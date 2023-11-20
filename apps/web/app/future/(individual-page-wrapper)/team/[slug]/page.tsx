import TeamPage from "@pages/team/[slug]";
import { ssrInit } from "app/_trpc/ssrInit";
import { _generateMetadata } from "app/_utils";
import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

import { orgDomainConfig, getOrgFullOrigin } from "@calcom/features/ee/organizations/lib/orgDomains";
import { getFeatureFlagMap } from "@calcom/features/flags/server/utils";
import logger from "@calcom/lib/logger";
import { markdownToSafeHTML } from "@calcom/lib/markdownToSafeHTML";
import { getTeamWithMembers } from "@calcom/lib/server/queries/teams";
import slugify from "@calcom/lib/slugify";
import { stripMarkdown } from "@calcom/lib/stripMarkdown";
import prisma from "@calcom/prisma";
import { RedirectType } from "@calcom/prisma/client";
import { teamMetadataSchema } from "@calcom/prisma/zod-utils";

import { getQuery } from "@lib/getQuery";
import { getTemporaryOrgRedirect } from "@lib/getTemporaryOrgRedirect";

import PageWrapper from "@components/PageWrapperAppDir";

export const generateMetadata = async () => {
  const params = getQuery(headers().get("x-url") ?? "", {});
  const { isValidOrgDomain, currentOrgDomain } = orgDomainConfig(headers(), params.orgSlug);
  const isOrgProfile = params.isOrgProfile === "1";

  const team = await getTeamWithMembers({
    orgSlug: currentOrgDomain,
    isTeamView: true,
    isOrgView: isValidOrgDomain && isOrgProfile,
  });
  return await _generateMetadata(
    () => team?.name ?? "Nameless Team",
    () => team?.name ?? "Nameless Team"
  );
};

const log = logger.getSubLogger({ prefix: ["team/[slug]"] });

const getProps = async (_params: Params) => {
  const h = headers();
  const params = getQuery(h.get("x-url") ?? "", _params);
  const slug = Array.isArray(params.slug) ? params.slug.pop() : params.slug;
  const { isValidOrgDomain, currentOrgDomain } = orgDomainConfig(h, params.orgSlug);
  const isOrgContext = isValidOrgDomain && currentOrgDomain;

  // Provided by Rewrite from next.config.js
  const isOrgProfile = params.isOrgProfile === "1";
  const flags = await getFeatureFlagMap(prisma);
  const isOrganizationFeatureEnabled = flags["organizations"];

  log.debug("getServerSideProps", {
    isOrgProfile,
    isOrganizationFeatureEnabled,
    isValidOrgDomain,
    currentOrgDomain,
  });

  const team = await getTeamWithMembers({
    slug: slugify(slug ?? ""),
    orgSlug: currentOrgDomain,
    isTeamView: true,
    isOrgView: isValidOrgDomain && isOrgProfile,
  });

  if (!isOrgContext && slug) {
    const redirectObj = await getTemporaryOrgRedirect({
      slug: slug,
      redirectType: RedirectType.Team,
      eventTypeSlug: null,
      currentQuery: params,
    });

    if (redirectObj) {
      return redirect(redirectObj.redirect.destination);
    }
  }

  const ssr = await ssrInit();
  const metadata = teamMetadataSchema.parse(team?.metadata ?? {});

  // Taking care of sub-teams and orgs
  if (
    (!isValidOrgDomain && team?.parent) ||
    (!isValidOrgDomain && !!metadata?.isOrganization) ||
    !isOrganizationFeatureEnabled
  ) {
    return notFound();
  }

  if (!team || (team.parent && !team.parent.slug)) {
    const unpublishedTeam = await prisma.team.findFirst({
      where: {
        ...(team?.parent
          ? { id: team.parent.id }
          : {
              metadata: {
                path: ["requestedSlug"],
                equals: slug,
              },
            }),
      },
    });

    if (!unpublishedTeam) return notFound();

    return {
      isUnpublished: true,
      team: { ...unpublishedTeam, createdAt: null },
      dehydratedState: await ssr.dehydrate(),
    };
  }

  team.eventTypes =
    team.eventTypes?.map((type) => ({
      ...type,
      users: type.users.map((user) => ({
        ...user,
        avatar: `/${user.username}/avatar.png`,
      })),
      descriptionAsSafeHTML: markdownToSafeHTML(type.description),
    })) ?? null;

  const safeBio = markdownToSafeHTML(team.bio) || "";

  const members = !team.isPrivate
    ? team.members.map((member) => {
        return {
          name: member.name,
          id: member.id,
          bio: member.bio,
          subteams: member.subteams,
          username: member.username,
          accepted: member.accepted,
          organizationId: member.organizationId,
          safeBio: markdownToSafeHTML(member.bio || ""),
          orgOrigin: getOrgFullOrigin(member.organization?.slug || ""),
        };
      })
    : [];

  const markdownStrippedBio = stripMarkdown(team?.bio || "");

  const { inviteToken: _inviteToken, ...serializableTeam } = team;

  return {
    team: { ...serializableTeam, safeBio, members, metadata },
    themeBasis: serializableTeam.slug,
    dehydratedState: await ssr.dehydrate(),
    markdownStrippedBio,
    isValidOrgDomain,
    currentOrgDomain,
  };
};

type PageProps = Readonly<{
  params: Params;
}>;

export default async function Page({ params }: PageProps) {
  const props = await getProps(params);

  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  return (
    <PageWrapper
      getLayout={null}
      isBookingPage={true}
      requiresLicense={false}
      nonce={nonce}
      themeBasis={null}
      {...props}>
      <TeamPage />
    </PageWrapper>
  );
}
