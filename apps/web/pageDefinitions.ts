import { getLayout } from "@calcom/features/MainLayout";

import type { AppProps } from "@lib/app-providers";

import PageWrapper from "@components/PageWrapperAppDir";

export const pageDefinitions: Record<
  string,
  {
    PageWrapper: AppProps["Component"]["PageWrapper"];
    getLayout: AppProps["Component"]["getLayout"];
  }
> = {
  // @TODO
  "/event-types-1": {
    PageWrapper,
    getLayout,
  },
};
