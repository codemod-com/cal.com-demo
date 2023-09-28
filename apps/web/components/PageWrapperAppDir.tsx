"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
// import I18nLanguageHandler from "@components/I18nLanguageHandler";
import { usePathname } from "next/navigation";
import Script from "next/script";

import "@calcom/embed-core/src/embed-iframe";
import LicenseRequired from "@calcom/features/ee/common/components/LicenseRequired";
import { IS_CALCOM, WEBAPP_URL } from "@calcom/lib/constants";
import { buildCanonical } from "@calcom/lib/next-seo.config";
import { trpc } from "@calcom/trpc/react";

import type { AppProps } from "@lib/app-providers";
import AppProviders from "@lib/app-providers-app-dir";

export interface CalPageWrapper {
  (props?: AppProps): JSX.Element;
  PageWrapper?: AppProps["Component"]["PageWrapper"];
}

const interFont = Inter({ subsets: ["latin"], variable: "--font-inter", preload: true, display: "swap" });
const calFont = localFont({
  src: "../fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal",
  preload: true,
  display: "swap",
});

export const buildMetadata = (path: string): Metadata => ({
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
  alternates: {
    canonical: IS_CALCOM
      ? buildCanonical({ path, origin: "https://cal.com" }) // cal.com & .dev
      : buildCanonical({ path, origin: WEBAPP_URL }),
  },
  twitter: {
    card: "summary_large_image",
    title: "@calcom",
  },
});

function PageWrapper(props: AppProps & { children: React.ReactNode }) {
  const { Component, pageProps, err, router } = props;
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
  const nonce = typeof window !== "undefined" ? (pageProps.nonce ? "" : undefined) : pageProps.nonce;
  const providerProps = {
    ...props,
    pageProps: {
      ...props.pageProps,
      nonce,
    },
  };
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AppProviders {...providerProps}>
      {/* <I18nLanguageHandler locales={props.router.locales || []} /> */}
      <Script
        nonce={nonce}
        id="page-status"
        dangerouslySetInnerHTML={{ __html: `window.CalComPageStatus = '${pageStatus}'` }}
      />
      <style jsx global>{`
        :root {
          --font-inter: ${interFont.style.fontFamily};
          --font-cal: ${calFont.style.fontFamily};
        }
      `}</style>

      {getLayout(
        Component.requiresLicense ? <LicenseRequired>{props.children}</LicenseRequired> : props.children,
        router
      )}
    </AppProviders>
  );
}

export default trpc.withTRPC(PageWrapper);
