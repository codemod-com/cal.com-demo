import Page from "@pages/video/meeting-not-started/[uid]";
import { _generateMetadata } from "app/_utils";
import { headers } from "next/headers";

import prisma, { bookingMinimalSelect } from "@calcom/prisma";

import PageWrapper from "@components/PageWrapperAppDir";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("this_meeting_has_not_started_yet"),
    () => ""
  );

type Params = { uid: string };

type PageProps = {
  params: Params;
};

export async function getProps({ params }: { params: Params }) {
  console.log(params.uid, "!@!@#!@#!@#!@#!@");
  const booking = await prisma.booking.findUnique({
    where: {
      uid: params.uid,
    },
    select: bookingMinimalSelect,
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

export default async function MeetingNotStarted({ params }: PageProps) {
  const props = await getProps({ params });
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  return (
    <PageWrapper getLayout={null} requiresLicense={false} nonce={nonce} themeBasis={null} {...props}>
      <Page />
    </PageWrapper>
  );
}
