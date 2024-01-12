"use client";

import { type DehydratedState } from "@tanstack/react-query";
import type { SSRConfig } from "next-i18next";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// import I18nLanguageHandler from "@components/I18nLanguageHandler";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Script from "next/script";
import type { ReactNode } from "react";

import "@calcom/embed-core/src/embed-iframe";
import LicenseRequired from "@calcom/features/ee/common/components/LicenseRequired";
import { useCompatSearchParams } from "@calcom/lib/hooks/useCompatSearchParams";

import type { AppProps } from "@lib/app-providers-app-dir";
import AppProviders from "@lib/app-providers-app-dir";

export interface CalPageWrapper {
  (props?: AppProps): JSX.Element;
  PageWrapper?: AppProps["Component"]["PageWrapper"];
}

function paramsToObject(searchParams: ReadonlyURLSearchParams) {
  const entries = Array.from(searchParams.entries());

  const result: Record<string, string | string[]> = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

export type PageWrapperProps = Readonly<{
  getLayout: ((page: React.ReactElement) => ReactNode) | null;
  children: React.ReactNode;
  requiresLicense: boolean;
  nonce: string | undefined;
  themeBasis: string | null;
  dehydratedState?: DehydratedState;
  isThemeSupported?: boolean;
  isBookingPage?: boolean;
  i18n?: SSRConfig;
}>;

function PageWrapper(props: PageWrapperProps) {
  const pathname = usePathname();
  let pageStatus = "200";

  if (pathname === "/404") {
    pageStatus = "404";
  } else if (pathname === "/500") {
    pageStatus = "500";
  }

  // On client side don't let nonce creep into DOM
  // It also avoids hydration warning that says that Client has the nonce value but server has "" because browser removes nonce attributes before DOM is built
  // See https://github.com/kentcdodds/nonce-hydration-issues
  // Set "" only if server had it set otherwise keep it undefined because server has to match with client to avoid hydration error
  const nonce = typeof window !== "undefined" ? (props.nonce ? "" : undefined) : props.nonce;
  const providerProps: PageWrapperProps = {
    ...props,
    nonce,
  };

  const getLayout: (page: React.ReactElement, router: AppRouterInstance) => ReactNode =
    props.getLayout ?? ((page) => page);

  const router = useRouter();

  const searchParams = useCompatSearchParams();

  const searchParamsObject = paramsToObject(searchParams);

  Object.assign(router, { query: searchParamsObject });

  return (
    <AppProviders {...providerProps}>
      {/* <I18nLanguageHandler locales={props.router.locales || []} /> */}
      <>
        <Script
          nonce={nonce}
          id="page-status"
          dangerouslySetInnerHTML={{ __html: `window.CalComPageStatus = '${pageStatus}'` }}
        />
        {getLayout(
          props.requiresLicense ? <LicenseRequired>{props.children}</LicenseRequired> : <>{props.children}</>,
          router
        )}
      </>
    </AppProviders>
  );
}

export default PageWrapper;
