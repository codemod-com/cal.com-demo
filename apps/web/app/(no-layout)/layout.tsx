// nested pages (e.g., /availability/[schedule].tsx) are supposed to go under (no-layout) folder
// because nested pages' components themselves already contain the layout
import { headers } from "next/headers";
import { type ReactElement } from "react";

import PageWrapper from "@components/PageWrapperAppDir";

type WrapperWithoutLayoutProps = {
  children: ReactElement;
};

export default async function WrapperWithoutLayout({ children }: WrapperWithoutLayoutProps) {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  return (
    // @ts-expect-error withTrpc expects AppProps
    <PageWrapper
      requiresLicense={false}
      nonce={nonce}
      themeBasis={null}
      pageProps={{ ...children?.props, trpcState: {} }}>
      {children}
    </PageWrapper>
  );
}
