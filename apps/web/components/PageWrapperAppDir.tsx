"use client";

import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { usePathname, useRouter } from "next/navigation";
// import Head from "next/head";
import Script from "next/script";

import "@calcom/embed-core/src/embed-iframe";
import LicenseRequired from "@calcom/features/ee/common/components/LicenseRequired";
import { trpc } from "@calcom/trpc/react";

import AppProviders from "@lib/app-providers-app-dir";
import type { AppProps } from "@lib/app-providers-app-dir";

// import I18nLanguageHandler from "@components/I18nLanguageHandler";

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

const getPageStatus = (pathname: string) => {
  let pageStatus = "200";

  if (pathname === "/404") {
    pageStatus = "404";
  } else if (pathname === "/500") {
    pageStatus = "500";
  }

  return pageStatus;
};

function PageWrapper(props: { children?: React.ReactNode; getLayout: AppProps["Component"]["getLayout"] }) {
  const { children } = props;

  const pathname = usePathname();
  const router = useRouter();
  // On client side don't let nonce creep into DOM
  // It also avoids hydration warning that says that Client has the nonce value but server has "" because browser removes nonce attributes before DOM is built
  // See https://github.com/kentcdodds/nonce-hydration-issues
  // Set "" only if server had it set otherwise keep it undefined because server has to match with client to avoid hydration error
  // @TODO
  // const nonce = typeof window !== "undefined" ? (pageProps.nonce ? "" : undefined) : pageProps.nonce;
  const nonce = "";
  const providerProps = {
    ...props,
    Component: {},
    pageProps: {},
  };
  // Use the layout defined at the page level, if available
  const getLayout = props.getLayout ?? ((page) => page);

  // const path = router.asPath;

  return (
    <AppProviders {...providerProps}>
      {/* @TODO next/head migration */}
      {/* <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head> */}
      {/* <DefaultSeo
        // Set canonical to https://cal.com or self-hosted URL
        canonical={
          IS_CALCOM
            ? buildCanonical({ path, origin: "https://cal.com" }) // cal.com & .dev
            : buildCanonical({ path, origin: WEBAPP_URL }) // self-hosted
        }
        {...seoConfig.defaultNextSeo}
      /> */}
      {/* @TODO i18n migration */}
      {/* <I18nLanguageHandler locales={props.router.locales || []} /> */}
      <Script
        nonce={nonce}
        id="page-status"
        dangerouslySetInnerHTML={{ __html: `window.CalComPageStatus = '${getPageStatus(pathname ?? "")}'` }}
      />
      <style jsx global>{`
        :root {
          --font-inter: ${interFont.style.fontFamily};
          --font-cal: ${calFont.style.fontFamily};
        }
      `}</style>
      {getLayout(false ? <LicenseRequired>{children}</LicenseRequired> : children, router)}
    </AppProviders>
  );
}

export default trpc.withTRPC(PageWrapper);
