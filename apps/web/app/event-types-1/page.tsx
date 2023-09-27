import type { ResolvingMetadata } from "next";

import { getLayout } from "@calcom/features/MainLayout";

import PageWrapper from "@components/PageWrapperAppDir";
import { buildMetadata } from "@components/PageWrapperMetadata";

import EventTypesPage from "./clientComponent";

export const generateMetadata = async (_: unknown, resolvingMetadata: ResolvingMetadata) => {
  const resolvedMetadata = await resolvingMetadata;

  return {
    ...resolvedMetadata,
    ...buildMetadata(""),
  };
};

export default function EventTypesPageWrapped(props) {
  const wrapperProps = {
    Component: {
      getLayout,
    },
    pageProps: { ...props },
    // @TODO
    router: {
      query: "",
    },
  };

  return (
    <PageWrapper {...wrapperProps}>
      <EventTypesPage />
    </PageWrapper>
  );
}
