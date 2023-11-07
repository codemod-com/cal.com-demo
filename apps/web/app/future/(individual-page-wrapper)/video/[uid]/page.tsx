import Page from "@pages/video/[uid]";
import { ssrInit } from "app/_trpc/ssrInit";
import { _generateMetadata } from "app/_utils";
import MarkdownIt from "markdown-it";
import { cookies, headers } from "next/headers";
import { type NextApiRequest } from "next/types";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { APP_NAME } from "@calcom/lib/constants";
import prisma, { bookingMinimalSelect } from "@calcom/prisma";

import PageWrapper from "@components/PageWrapperAppDir";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => `${APP_NAME} Video`,
    () => ""
  );
type Params = { uid: string };

type PageProps = {
  params: Params;
};

const md = new MarkdownIt("default", { html: true, breaks: true, linkify: true });

async function getProps({ params }: { params: Params }) {
  const ssr = await ssrInit();

  const booking = await prisma.booking.findUnique({
    where: {
      uid: params.uid,
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
  } as unknown as NextApiRequest;
  const session = await getServerSession({ req });

  // set meetingPassword to null for guests
  if (session?.user.id !== bookingObj.user?.id) {
    bookingObj.references.forEach((bookRef) => {
      bookRef.meetingPassword = null;
    });
  }

  return {
    meetingUrl: bookingObj.references[0].meetingUrl ?? "",
    ...(typeof bookingObj.references[0].meetingPassword === "string" && {
      meetingPassword: bookingObj.references[0].meetingPassword,
    }),
    booking: {
      ...bookingObj,
      ...(bookingObj.description && { description: md.render(bookingObj.description) }),
    },
    dehydratedState: await ssr.dehydrate(),
  };
}

export default async function VideoPage({ params }: PageProps) {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  const props = await getProps({ params });

  return (
    <PageWrapper
      getLayout={(page) => page}
      requiresLicense={false}
      nonce={nonce}
      themeBasis={null}
      {...props}>
      <Page />
    </PageWrapper>
  );
}
