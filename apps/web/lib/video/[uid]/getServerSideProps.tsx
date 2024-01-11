import MarkdownIt from "markdown-it";
import type { GetServerSidePropsContext } from "next";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import prisma, { bookingMinimalSelect } from "@calcom/prisma";

import { ssrInit } from "@server/lib/ssr";

const md = new MarkdownIt("default", { html: true, breaks: true, linkify: true });

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res } = context;

  const ssr = await ssrInit(context);

  const booking = await prisma.booking.findUnique({
    where: {
      uid: context.query.uid as string,
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
          organization: {
            select: {
              calVideoLogo: true,
            },
          },
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
    const redirect = {
      redirect: {
        destination: "/video/no-meeting-found",
        permanent: false,
      },
    } as const;

    return redirect;
  }

  //daily.co calls have a 60 minute exit buffer when a user enters a call when it's not available it will trigger the modals
  const now = new Date();
  const exitDate = new Date(now.getTime() - 60 * 60 * 1000);

  //find out if the meeting is in the past
  const isPast = booking?.endTime <= exitDate;
  if (isPast) {
    const redirect = {
      redirect: {
        destination: `/video/meeting-ended/${booking?.uid}`,
        permanent: false,
      },
    } as const;

    return redirect;
  }

  const bookingObj = Object.assign({}, booking, {
    startTime: booking.startTime.toString(),
    endTime: booking.endTime.toString(),
  });

  const session = await getServerSession({ req, res });

  // set meetingPassword to null for guests
  if (session?.user.id !== bookingObj.user?.id) {
    bookingObj.references.forEach((bookRef) => {
      bookRef.meetingPassword = null;
    });
  }

  const videoReferences = bookingObj.references.filter((reference) => reference.type.includes("_video"));
  const latestVideoReference = videoReferences[videoReferences.length - 1];

  return {
    props: {
      meetingUrl: latestVideoReference.meetingUrl ?? "",
      ...(typeof latestVideoReference.meetingPassword === "string" && {
        meetingPassword: latestVideoReference.meetingPassword,
      }),
      booking: {
        ...bookingObj,
        ...(bookingObj.description && { description: md.render(bookingObj.description) }),
      },
      trpcState: ssr.dehydrate(),
    },
  };
}
