import Page from "@pages/teams";
import { ssrInit } from "app/_trpc/ssrInit";
import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getLayout } from "@calcom/features/MainLayoutAppDir";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

import PageWrapper from "@components/PageWrapperAppDir";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("teams"),
    (t) => t("create_manage_teams_collaborative")
  );

type Params = { token: string[] | string };

type PageProps = {
  params: Params;
};

const getProps = async (_token: string[] | string) => {
  const ssr = await ssrInit();
  await ssr.viewer.me.prefetch();
  const req = { cookies: cookies(), headers: headers() };

  const session = await getServerSession({
    // @ts-expect-error emulate req
    req,
  });

  if (!session) {
    const token = Array.isArray(_token) ? _token[0] : _token;

    const callbackUrl = token ? `/teams?token=${encodeURIComponent(token)}` : null;
    return redirect(callbackUrl ? `/auth/login?callbackUrl=${callbackUrl}` : "/auth/login");
  }

  return { dehydratedState: await ssr.dehydrate() };
};

export default async function Teams({ params }: PageProps) {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;
  console.log(params.token);

  return (
    <PageWrapper getLayout={getLayout} requiresLicense={false} nonce={nonce} themeBasis={null}>
      <Page isAppDir />
    </PageWrapper>
  );
}
