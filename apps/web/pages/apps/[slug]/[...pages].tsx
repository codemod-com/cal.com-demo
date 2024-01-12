"use client";

import { useParamsWithFallback } from "@calcom/lib/hooks/useParamsWithFallback";
import type { AppGetServerSideProps } from "@calcom/types/AppGetServerSideProps";

import type { AppProps } from "@lib/app-providers";
import { getServerSideProps, getRoute } from "@lib/apps/[slug]/[...pages]/getServerSideProps";

import PageWrapper from "@components/PageWrapper";

export { getServerSideProps };

type AppPageType = {
  getServerSideProps: AppGetServerSideProps;
  // A component than can accept any properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ((props: any) => JSX.Element) &
    Pick<AppProps["Component"], "isBookingPage" | "getLayout" | "PageWrapper">;
};

const AppPage: AppPageType["default"] = function AppPage(props) {
  const appName = props.appName;
  const params = useParamsWithFallback();
  const pages = (params.pages || []) as string[];
  const route = getRoute(appName, pages);

  const componentProps = {
    ...props,
    pages: pages.slice(1),
  };

  if (!route || route.notFound) {
    throw new Error("Route can't be undefined");
  }
  return <route.Component {...componentProps} />;
};

AppPage.isBookingPage = ({ router }) => {
  const route = getRoute(router.query.slug as string, router.query.pages as string[]);
  if (route.notFound) {
    return false;
  }
  const isBookingPage = route.Component.isBookingPage;
  if (typeof isBookingPage === "function") {
    return isBookingPage({ router });
  }

  return !!isBookingPage;
};

export const getLayout: NonNullable<(typeof AppPage)["getLayout"]> = (page, router) => {
  const route = getRoute(router.query.slug as string, router.query.pages as string[]);
  if (route.notFound) {
    return null;
  }
  if (!route.Component.getLayout) {
    return page;
  }
  console.log("here?");
  return route.Component.getLayout(page, router);
};

AppPage.getLayout = getLayout;
AppPage.PageWrapper = PageWrapper;

export default AppPage;
