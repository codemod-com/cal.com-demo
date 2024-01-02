import type { LayoutProps, PageProps } from "app/_types";
import { cookies, headers } from "next/headers";

import { buildLegacyCtx } from "@lib/buildLegacyCtx";

import PageWrapper from "@components/PageWrapperAppDir";

type WithLayoutParams<T extends Record<string, any>> = {
  getLayout: ((page: React.ReactNode) => JSX.Element) | null;
  Page?: (props: T) => React.ReactElement;
  getData?: (arg: ReturnType<typeof buildLegacyCtx>) => Promise<T>;
};

export function WithLayout<T extends Record<string, any>>({ getLayout, getData, Page }: WithLayoutParams<T>) {
  return async ({ params, ...restProps }: PageProps | LayoutProps) => {
    const h = headers();
    const nonce = h.get("x-nonce") ?? undefined;
    const props = getData ? await getData(buildLegacyCtx(h, cookies(), params)) : ({} as T);

    return (
      <PageWrapper getLayout={getLayout} requiresLicense={false} nonce={nonce} themeBasis={null} {...props}>
        {Page ? <Page {...props} /> : "children" in restProps ? restProps.children : null}
      </PageWrapper>
    );
  };
}
