import { ssrInit } from "app/_trpc/ssrInit";
import MarkdownIt from "markdown-it";
import { cookies, headers } from "next/headers";
import { type ReactElement } from "react";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import prisma, { bookingMinimalSelect } from "@calcom/prisma";

import PageWrapper from "@components/PageWrapperAppDir";

type LayoutProps = {
  children: ReactElement;
};

const md = new MarkdownIt("default", { html: true, breaks: true, linkify: true });

async function getProps() {
  const ssr = await ssrInit();
  const uid = "uid" ?? (query.uid as string);
  const booking = await prisma.booking.findUnique({
    where: {
      uid,
    },
    select: {
      ...bookingMinimalSelect,
      uid: true,
      description: true,
      isRecorded: true,
      user: {
        select: {
          id: true,
          timeZone: true,
          name: true,
          email: true,
        },
      },
      references: {
        select: {
          uid: true,
          type: true,
          meetingUrl: true,
          meetingPassword: true,
        },
        where: {
          type: "daily_video",
        },
      },
    },
  });

  if (!booking || booking.references.length === 0 || !booking.references[0].meetingUrl) {
    return {
      redirect: {
        destination: "/video/no-meeting-found",
        permanent: false,
      },
    };
  }

  //daily.co calls have a 60 minute exit buffer when a user enters a call when it's not available it will trigger the modals
  const now = new Date();
  const exitDate = new Date(now.getTime() - 60 * 60 * 1000);

  //find out if the meeting is in the past
  const isPast = booking?.endTime <= exitDate;
  if (isPast) {
    return {
      redirect: {
        destination: `/video/meeting-ended/${booking?.uid}`,
        permanent: false,
      },
    };
  }

  const bookingObj = Object.assign({}, booking, {
    startTime: booking.startTime.toString(),
    endTime: booking.endTime.toString(),
  });
  const req = {
    cookies: cookies(),
    headers: headers(),
  };
  const session = await getServerSession({ req });

  // set meetingPassword to null for guests
  if (session?.user.id !== bookingObj.user?.id) {
    bookingObj.references.forEach((bookRef) => {
      bookRef.meetingPassword = null;
    });
  }

  return {
    props: {
      meetingUrl: bookingObj.references[0].meetingUrl ?? "",
      ...(typeof bookingObj.references[0].meetingPassword === "string" && {
        meetingPassword: bookingObj.references[0].meetingPassword,
      }),
      booking: {
        ...bookingObj,
        ...(bookingObj.description && { description: md.render(bookingObj.description) }),
      },
      dehydratedState: await ssr.dehydrate(),
    },
  };
}

export default async function Layout({ children }: LayoutProps) {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;
  const props = await getProps();

  return (
    <PageWrapper
      getLayout={(page) => page}
      requiresLicense={false}
      nonce={nonce}
      themeBasis={null}
      {...props}>
      {children}
    </PageWrapper>
  );
}
