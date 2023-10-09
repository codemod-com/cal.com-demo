import { headers as nextHeaders, cookies as nextCookies } from "next/headers";
import Script from "next/script";
import React from "react";

import { getLocale } from "@calcom/features/auth/lib/getLocale";
import { IS_PRODUCTION } from "@calcom/lib/constants";

import { prepareMetadata } from "@lib/metadata";

import "../styles/globals.css";
import { TrpcProvider } from "./_trpc/trpc-provider";

export const generateMetadata = () =>
  prepareMetadata({
    twitterCreator: "@calcom",
    twitterSite: "@calcom",
    robots: {
      index: false,
      follow: false,
    },
  });

const getInitialProps = async (
  url: string,
  headers: ReturnType<typeof nextHeaders>,
  cookies: ReturnType<typeof nextCookies>
) => {
  const { pathname, searchParams } = new URL(url);

  const isEmbed = pathname.endsWith("/embed") || (searchParams?.get("embedType") ?? null) !== null;
  const embedColorScheme = searchParams?.get("ui.color-scheme");

  // @ts-expect-error we cannot access ctx.req in app dir, however headers and cookies are only properties needed to extract the locale
  const newLocale = await getLocale({ headers, cookies });
  let direction = "ltr";

  try {
    const intlLocale = new Intl.Locale(newLocale);
    // @ts-expect-error INFO: Typescript does not know about the Intl.Locale textInfo attribute
    direction = intlLocale.textInfo?.direction;
  } catch (e) {
    console.error(e);
  }

  return { isEmbed, embedColorScheme, locale: newLocale, direction };
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headers = nextHeaders();
  const cookies = nextCookies();

  const fullUrl = headers.get("x-url") ?? "";
  const nonce = headers.get("x-csp") ?? "";

  const { locale, direction, isEmbed, embedColorScheme } = await getInitialProps(fullUrl, headers, cookies);
  return (
    <html
      lang={locale}
      dir={direction}
      style={embedColorScheme ? { colorScheme: embedColorScheme as string } : undefined}>
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
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  );
}
