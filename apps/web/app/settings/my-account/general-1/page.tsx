// This file has been sourced from: /intuita/cal.com-demo/apps/web/pages/settings/my-account/general.tsx
import Components from "@pages/settings/my-account/general";
import { headers } from "next/headers";

import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";

import PageWrapper from "@components/PageWrapperAppDir";

export default function General(props: Record<string, unknown>) {
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
