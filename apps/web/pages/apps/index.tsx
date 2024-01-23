import { getLayout } from "@calcom/features/MainLayout";

import { getServerSideProps } from "@lib/apps/getServerSideProps";

import PageWrapper from "@components/PageWrapper";

import Apps from '@components/pages/apps';

export { getServerSideProps };

Apps.PageWrapper = PageWrapper;
Apps.getLayout = getLayout;
