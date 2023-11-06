import { ssrInit } from "app/_trpc/ssrInit";
import { cookies, headers } from "next/headers";
import { type NextRequest } from "next/server";
import { type ReactElement } from "react";

import { getLayout } from "@calcom/features/MainLayoutAppDir";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

import PageWrapper from "@components/PageWrapperAppDir";

type LayoutProps = {
  children: ReactElement;
};

const getProps = async () => {
  const ssr = await ssrInit();
  await ssr.viewer.me.prefetch();
  const req: NextRequest = { cookies: cookies(), headers: headers() };
  const session = await getServerSession({
    req,
  });

  // const token = Array.isArray(context.query?.token) ? context.query.token[0] : context.query?.token;
  const token = null;
  const callbackUrl = token ? `/teams?token=${encodeURIComponent(token)}` : null;

  if (!session) {
    return {
      redirect: {
        destination: callbackUrl ? `/auth/login?callbackUrl=${callbackUrl}` : "/auth/login",
        permanent: false,
      },
    };
  }

  return { dehydratedState: await ssr.dehydrate() };
};

export default async function Layout({ children }: LayoutProps) {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;
  const props = await getProps();

  return (
    <PageWrapper getLayout={getLayout} requiresLicense={false} nonce={nonce} themeBasis={null} {...props}>
      {children}
    </PageWrapper>
  );
}
