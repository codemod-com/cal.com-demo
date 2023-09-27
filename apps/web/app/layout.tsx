import type { Metadata } from "next";
import { headers as nextHeaders } from "next/headers";
import Script from "next/script";
import React from "react";

import { IS_PRODUCTION } from "@calcom/lib/constants";

import "../styles/globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        sizes: "32x32",
        url: "/api/logo?type=favicon-32",
      },
      {
        sizes: "16x16",
        url: "/api/logo?type=favicon-16",
      },
    ],
    apple: {
      sizes: "180x180",
      url: "/api/logo?type=apple-touch-icon",
    },
    other: [
      {
        url: "/safari-pinned-tab.svg",
        rel: "mask-icon",
      },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1C1C" },
  ],
  other: {
    "msapplication-TileColor": "#000000",
  },
};

const getInitialProps = async (url: string) => {
  // @TODO
  const { pathname, searchParams } = new URL("http://localhost:3000/event-types-1");
  // @TODO
  // const { nonce } = csp(ctx.req || null, ctx.res || null);
  // if (!process.env.CSP_POLICY) {
  //   setHeader(ctx, "x-csp", "not-opted-in");
  // } else if (!ctx.res?.getHeader("x-csp")) {
  //   // If x-csp not set by gSSP, then it's initialPropsOnly
  //   setHeader(ctx, "x-csp", "initialPropsOnly");
  // }

  const isEmbed = pathname.endsWith("/embed") || (searchParams?.get("embedType") ?? null) !== null;
  const embedColorScheme = searchParams?.get("ui.color-scheme");

  // @TODO locale will be implemented during i18n migration
  return { isEmbed, embedColorScheme, nonce: "", locale: "en" };
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headers = nextHeaders();
  const fullUrl = headers.get("referer") ?? "";
  const { locale, isEmbed, embedColorScheme, nonce } = await getInitialProps(fullUrl);

  return (
    <html lang={locale} style={embedColorScheme ? { colorScheme: embedColorScheme as string } : undefined}>
      <head nonce={nonce}>
        {!IS_PRODUCTION && process.env.VERCEL_ENV === "preview" && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <Script
            data-project-id="KjpMrKTnXquJVKfeqmjdTffVPf1a6Unw2LZ58iE4"
            src="https://snippet.meticulous.ai/v1/stagingMeticulousSnippet.js"
          />
        )}
      </head>
      <body
        className="dark:bg-darkgray-50 desktop-transparent bg-subtle antialiased"
        style={
          isEmbed
            ? {
                background: "transparent",
                // Keep the embed hidden till parent initializes and
                // - gives it the appropriate styles if UI instruction is there.
                // - gives iframe the appropriate height(equal to document height) which can only be known after loading the page once in browser.
                // - Tells iframe which mode it should be in (dark/light) - if there is a a UI instruction for that
                visibility: "hidden",
              }
            : {}
        }>
        {children}
      </body>
    </html>
  );
}
