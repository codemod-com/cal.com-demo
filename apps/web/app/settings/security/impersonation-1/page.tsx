import Components from "@pages/settings/security/impersonation";
import { headers } from "next/headers";

import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";

import PageWrapper from "@components/PageWrapperAppDir";

export default async function Impersonation(props: Record<string, unknown>) {
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
