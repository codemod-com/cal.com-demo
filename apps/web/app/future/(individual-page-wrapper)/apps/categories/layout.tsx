import { type ReactElement } from "react";

import { getLayout } from "@calcom/features/MainLayout";

import PageWrapper from "@components/PageWrapperAppDir";

type EventTypesLayoutProps = {
  children: ReactElement;
};

export default function Layout({ children }: EventTypesLayoutProps) {
  return (
    <PageWrapper getLayout={getLayout} requiresLicense={false} nonce={undefined} themeBasis={null}>
      {children}
    </PageWrapper>
  );
}
