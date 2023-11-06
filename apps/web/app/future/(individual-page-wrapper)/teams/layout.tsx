import { ssrInit } from "app/_trpc/ssrInit";
import { headers } from "next/headers";
import { type ReactElement } from "react";

import { getLayout } from "@calcom/features/MainLayoutAppDir";

import PageWrapper from "@components/PageWrapperAppDir";

type LayoutProps = {
  children: ReactElement;
};

const getState = async () => {
  const ssr = await ssrInit();
  await ssr.viewer.me.prefetch();

  return ssr.dehydrate();
};

export default async function Layout({ children }: LayoutProps) {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;
  const state = await getState();

  return (
    <PageWrapper
      getLayout={getLayout}
      requiresLicense={false}
      nonce={nonce}
      themeBasis={null}
      dehydratedState={state}>
      {children}
    </PageWrapper>
  );
}
