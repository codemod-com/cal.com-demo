import NotFoundPage from "@pages/404";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cookies, headers } from "next/headers";

import { getLocale } from "@calcom/features/auth/lib/getLocale";

import PageWrapper from "@components/PageWrapperAppDir";

const getProps = async () => {
  const req = { headers: headers(), cookies: cookies() };
  const locale = await getLocale(req);

  const i18n = (await serverSideTranslations(locale)) || "en";

  return {
    i18n,
  };
};

const NotFound = async () => {
  const nonce = headers().get("x-nonce") ?? undefined;

  const { i18n } = await getProps();

  return (
    <PageWrapper getLayout={null} requiresLicense={false} nonce={nonce} themeBasis={null} i18n={i18n}>
      <NotFoundPage />
    </PageWrapper>
  );
};

export default NotFound;
