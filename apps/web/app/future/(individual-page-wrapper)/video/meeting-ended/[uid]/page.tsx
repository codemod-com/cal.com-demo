import Page from "@pages/video/meeting-ended/[uid]";
import { _generateMetadata } from "app/_utils";
import { headers } from "next/headers";

import prisma, { bookingMinimalSelect } from "@calcom/prisma";

import PageWrapper from "@components/PageWrapperAppDir";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Meeting Unavailable",
    () => "Meeting Unavailable"
  );

type Params = { uid: string };

type PageProps = {
  params: Params;
};

export async function getProps({ params }: { params: Params }) {
  const booking = await prisma.booking.findUnique({
    where: {
      uid: params.uid,
    },
    select: {
      ...bookingMinimalSelect,
      uid: true,
      user: {
        select: {
          credentials: true,
        },
      },
      references: {
        select: {
          uid: true,
          type: true,
          meetingUrl: true,
        },
      },
    },
  });

  if (!booking) {
    return {
      redirect: {
        destination: "/video/no-meeting-found",
        permanent: false,
      },
    };
  }

  const bookingObj = Object.assign({}, booking, {
    startTime: booking.startTime.toString(),
    endTime: booking.endTime.toString(),
  });

  return {
    booking: bookingObj,
  };
}

export default async function MeetingEnded({ params }: PageProps) {
  const props = await getProps({ params });
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  return (
    <PageWrapper getLayout={null} requiresLicense={false} nonce={nonce} themeBasis={null} {...props}>
      <Page booking={props.booking} />
    </PageWrapper>
  );
}
