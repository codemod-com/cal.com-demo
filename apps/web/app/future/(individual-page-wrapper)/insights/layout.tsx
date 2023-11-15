import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { type ReactElement } from "react";

import { getLayout } from "@calcom/features/MainLayoutAppDir";
import { getFeatureFlagMap } from "@calcom/features/flags/server/utils";

import PageWrapper from "@components/PageWrapperAppDir";

type InsightsLayoutProps = {
  children: ReactElement;
};

// If feature flag is disabled, return not found on getServerSideProps
const getProps = async () => {
  const prisma = await import("@calcom/prisma").then((mod) => mod.default);
  const flags = await getFeatureFlagMap(prisma);

  if (flags.insights === false) {
    return notFound();
  }

  return {};
};

export default async function InsightsLayout({ children }: InsightsLayoutProps) {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;
  const props = await getProps();

  return (
    <PageWrapper getLayout={getLayout} requiresLicense={false} nonce={nonce} themeBasis={null} {...props}>
      {children}
    </PageWrapper>
  );
}
