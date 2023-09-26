"use client";

import { getLayout } from "@calcom/features/MainLayout";

import type { AppProps } from "@lib/app-providers";

import PageWrapper from "@components/PageWrapperAppDir";

type GetLayout = AppProps["Component"]["getLayout"];

export const pageDefinitions: Record<
  string,
  {
    PageWrapper: (props: { children?: React.ReactNode; getLayout: GetLayout }) => JSX.Element;
    getLayout: GetLayout;
  }
> = {
  // @TODO
  "/event-types-1": {
    PageWrapper,
    getLayout,
  },
};
