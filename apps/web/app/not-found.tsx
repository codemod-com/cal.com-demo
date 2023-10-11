import NotFoundPage from "@pages/legacy_404";
import config from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { headers } from "next/headers";

import PageWrapper from "@components/PageWrapperAppDir";

const getProps = async () => {
  const i18n = await serverSideTranslations("en", undefined, config);

  return {
    i18n,
  };
};

const NotFound = async () => {
  const h = headers();

  const nonce = h.get("x-nonce") ?? undefined;

  const { i18n } = await getProps();
  return (
    // @ts-expect-error withTrpc expects AppProps
    <PageWrapper requiresLicense={false} pageProps={{ i18n }} nonce={nonce} themeBasis={null} i18n={i18n}>
      <NotFoundPage />
    </PageWrapper>
  );
};

export default NotFound;
export const runtime = "nodejs";
