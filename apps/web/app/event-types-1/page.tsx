import EventTypesPage from "@pages/event-types";
import type { ResolvingMetadata } from "next";

import { getLayout } from "@calcom/features/MainLayout";

import PageWrapper from "@components/PageWrapperAppDir";
import { buildMetadata } from "@components/PageWrapperMetadata";

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
  };

  return (
    <PageWrapper {...wrapperProps}>
      <EventTypesPage />
    </PageWrapper>
  );
}
