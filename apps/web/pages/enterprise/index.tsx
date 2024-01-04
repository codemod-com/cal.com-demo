"use client";

import EnterprisePage from "@pages/enterprise/component";

import { getLayout } from "@calcom/features/MainLayout";

import PageWrapper from "@components/PageWrapper";

const ProxifiedEnterprisePage = new Proxy<{
  (): JSX.Element;
  PageWrapper?: typeof PageWrapper;
  getLayout?: typeof getLayout;
}>(EnterprisePage, {});

ProxifiedEnterprisePage.PageWrapper = PageWrapper;
ProxifiedEnterprisePage.getLayout = getLayout;

export default ProxifiedEnterprisePage;
