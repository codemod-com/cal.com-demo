import Page from '@components/apps/page';

import { getLayout } from "@calcom/features/MainLayout";
import  { getServerSideProps } from "@lib/apps/getServerSideProps";

import PageWrapper from "@components/PageWrapper";

export { getServerSideProps }

export default Page;
// @ts-expect-error
Page.PageWrapper = PageWrapper;
// @ts-expect-error
Page.getLayout = getLayout;
