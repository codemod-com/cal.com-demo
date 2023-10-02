// This file has been sourced from: /intuita/cal.com-demo/apps/web/pages/settings/security/impersonation.tsx
import { headers } from "next/headers";

import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";

import PageWrapper from "@components/PageWrapperAppDir";

import Components from "./components";

export default async function Impersonation(props: any) {
  // it used SSR init
  const h = headers();

  const nonce = h.get("x-nonce") ?? undefined;

  return (
    <PageWrapper
      getLayout={getLayout}
      requiresLicense={false}
      pageProps={props}
      nonce={nonce}
      themeBasis={null}>
      <Components {...props} />
    </PageWrapper>
  );
}
