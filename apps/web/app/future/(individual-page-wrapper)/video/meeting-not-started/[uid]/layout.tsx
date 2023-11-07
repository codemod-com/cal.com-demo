import { headers } from "next/headers";
import { type ReactElement } from "react";

import prisma, { bookingMinimalSelect } from "@calcom/prisma";

import PageWrapper from "@components/PageWrapperAppDir";

type LayoutProps = {
  children: ReactElement;
};

async function getProps(uid: string) {
  const booking = await prisma.booking.findUnique({
    where: {
      uid,
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

export default async function Layout({ children }: LayoutProps) {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;
  const fullUrl = h.get("x-url") ?? "";
  const uid = new URL(fullUrl).searchParams.get("uid") ?? "";

  const props = await getProps(uid);

  return (
    <PageWrapper getLayout={null} requiresLicense={false} nonce={nonce} themeBasis={null} {...props}>
      {children}
    </PageWrapper>
  );
}
