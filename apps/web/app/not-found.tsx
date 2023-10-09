import NotFoundPage from "@pages/legacy_404";
import { headers } from "next/headers";

import PageWrapper from "@components/PageWrapperAppDir";

const getProps = async () => {
  // until ssgInit is migrated
  const _i18n = await fetch(
    "https://app.cal.com/api/trpc/public/i18n?input=%7B%22json%22%3A%7B%22locale%22%3A%22en%22%2C%22CalComVersion%22%3A%223.3.6%22%7D%7D",
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

  return (
    // @ts-expect-error withTrpc expects AppProps
    <PageWrapper requiresLicense={false} pageProps={{ i18n }} nonce={nonce} themeBasis={null} i18n={i18n}>
      <NotFoundPage />
    </PageWrapper>
  );
};

export default NotFound;
export const runtime = "nodejs";
