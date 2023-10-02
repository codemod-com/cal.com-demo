import NotFoundPage from "@pages/_404";
import { headers } from "next/headers";

import PageWrapper from "@components/PageWrapperAppDir";

import { ssgInit } from "@server/lib/ssg";

const getProps = async () => {
  // @TODO will be fixed after i18n migration
  const ssr = await ssgInit({ params: { locale: "en" } });

  return {
    props: {
      trpcState: ssr.dehydrate(),
    },
  };
};

const NotFound = async () => {
  const h = headers();

  const nonce = h.get("x-nonce") ?? undefined;

  const pageProps = await getProps();

  return (
    <PageWrapper requiresLicense={false} pageProps={pageProps} nonce={nonce} themeBasis={null}>
      <NotFoundPage {...pageProps} />
    </PageWrapper>
  );
};

export default NotFound;
export const runtime = "nodejs";
