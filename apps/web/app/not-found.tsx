import NotFoundPage from "@pages/legacy_404";
import { headers } from "next/headers";

import { CALCOM_VERSION } from "@calcom/lib/constants";

import PageWrapper from "@components/PageWrapperAppDir";

const getProps = async () => {
  // until ssgInit is migrated
  const _i18n = await fetch(
    `https://app.cal.com/api/trpc/public/i18n?input={"json":{"locale":"en","CalComVersion":"${CALCOM_VERSION}"}}`,
    { cache: "no-cache" }
  );

  return {
    i18n: (await _i18n.json()).result.data.json.i18n,
  };
};

const NotFound = async () => {
  const h = headers();

  const nonce = h.get("x-nonce") ?? undefined;

  const { i18n } = await getProps();
  console.log(i18n, "?");
  return (
    // @ts-expect-error withTrpc expects AppProps
    <PageWrapper requiresLicense={false} pageProps={{ i18n }} nonce={nonce} themeBasis={null} i18n={i18n}>
      <NotFoundPage />
    </PageWrapper>
  );
};

export default NotFound;
export const runtime = "nodejs";
