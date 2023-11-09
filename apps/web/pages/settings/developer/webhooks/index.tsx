"use client";

import WeebhooksView from "@calcom/features/webhooks/pages/webhooks-view";

import type { CalPageWrapper } from "@components/PageWrapper";
import PageWrapper from "@components/PageWrapper";

const Page: CalPageWrapper = WeebhooksView;
Page.PageWrapper = PageWrapper;

export default Page;
