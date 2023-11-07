import { headers } from "next/headers";
import { useSearchParams } from "next/navigation";
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

export default async function Layout({ children }: LayoutProps) {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  const searchParams = useSearchParams();
  const props = await getProps(searchParams?.get("uid") ?? "");

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
