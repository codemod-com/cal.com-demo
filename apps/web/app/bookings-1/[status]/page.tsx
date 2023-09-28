import Bookings from "@pages/bookings/[status]";
import type { ResolvingMetadata } from "next";
import type { GetStaticPaths, GetStaticProps } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { z } from "zod";

import { getLayout } from "@calcom/features/MainLayout";
import { IS_CALCOM, WEBAPP_URL } from "@calcom/lib/constants";

import PageWrapper from "@components/PageWrapperAppDir";

import { ssgInit } from "@server/lib/ssg";

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
      canonical: `/event-types/${params.status}`,
    },
    twitter: {
      card: "summary_large_image",
      title: "@calcom",
    },
  };
};

type Props = { params: { status: string } };

const getPageProps = async ({ params }: Props) => {
  const result = await getStaticProps({ params });

  if ("notFound" in result) {
    return notFound();
  }

  if ("props" in result) {
    return result.props;
  }

  return {};
};

const getStaticProps: GetStaticProps = async (ctx) => {
  const params = querySchema.safeParse(ctx.params);
  const ssg = await ssgInit(ctx);

  if (!params.success) return { notFound: true };

  return {
    props: {
      status: params.data.status,
      trpcState: ssg.dehydrate(),
    },
  };
};

const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: validStatuses.map((status) => ({
      params: { status },
      locale: "en",
    })),
    fallback: "blocking",
  };
};

export const generateStaticParams = async () => {
  const staticPath = getStaticPaths(null);

  return staticPath.paths.map(({ params }) => ({
    status: params.status,
  }));
};

export default async function BookingPagesWrapped({ params }: Props) {
  const props = await getPageProps({ params });
  console.log(props, "props");
  const wrapperProps = {
    Component: {
      getLayout,
    },
    pageProps: { ...props },
  };

  return (
    <PageWrapper {...wrapperProps}>
      <Bookings />
    </PageWrapper>
  );
}

export const dynamicParams = true;
// export const dynamic = "force-static";
