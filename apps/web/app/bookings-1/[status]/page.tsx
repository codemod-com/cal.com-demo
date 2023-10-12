import Bookings from "@pages/bookings/[status]";
import type { ResolvingMetadata } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { notFound } from "next/navigation";
import React from "react";
import { z } from "zod";

import { IS_CALCOM, WEBAPP_URL } from "@calcom/lib/constants";

import PageWrapper from "@components/PageWrapperAppDir";

const validStatuses = ["upcoming", "recurring", "past", "cancelled", "unconfirmed"] as const;

const querySchema = z.object({
  status: z.enum(validStatuses),
});

export const generateMetadata = async (
  { params }: { params: { status: string } },
  parent: ResolvingMetadata
) => {
  return {
    ...(await parent),
    viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
    metadataBase: new URL(IS_CALCOM ? "https://cal.com" : WEBAPP_URL),
    alternates: {
      canonical: `/bookings/${params.status}`,
    },
    twitter: {
      card: "summary_large_image",
      title: "@calcom",
    },
  };
};

type Props = { params: { status: string } };

const getData = async ({ params }: Props) => {
  const parsedParams = querySchema.safeParse(params);

  if (!parsedParams.success) {
    return notFound();
  }

  const i18n = await serverSideTranslations("en");

  return {
    i18n,
    status: parsedParams.data.status,
  };
};

export const generateStaticParams = async () => {
  return validStatuses.map((status) => ({
    status,
  }));
};

export default async function BookingPagesWrapped({ params }: Props) {
  const { i18n } = await getData({ params });

  return (
    // @ts-expect-error withTrpc expects AppProps
    <PageWrapper requiresLicense={false} pageProps={{ i18n }} nonce={nonce} themeBasis={null} i18n={i18n}>
      <Bookings />
    </PageWrapper>
  );
}

export const dynamicParams = true;
export const dynamic = "force-static";
