"use client";

import type { Session } from "next-auth";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { pageDefinitions } from "pageDefinitions";
import React from "react";

import { IS_PRODUCTION } from "@calcom/lib/constants";

import "../styles/globals.css";

// export const metadata: Metadata = {
//   icons: {
//     icon: [
//       {
//         sizes: "32x32",
//         url: "/api/logo?type=favicon-32",
//       },
//       {
//         sizes: "16x16",
//         url: "/api/logo?type=favicon-16",
//       },
//     ],
//     apple: {
//       sizes: "180x180",
//       url: "/api/logo?type=apple-touch-icon",
//     },
//     other: [
//       {
//         url: "/safari-pinned-tab.svg",
//         rel: "mask-icon",
//       },
//     ],
//   },
//   manifest: "/site.webmanifest",
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
//     { media: "(prefers-color-scheme: dark)", color: "#1C1C1C" },
//   ],
//   other: {
//     "msapplication-TileColor": "#000000",
//   },
// };

const getInitialProps = async (pathname: string, searchParams: ReadonlyURLSearchParams | null) => {
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
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { locale, embedColorScheme, nonce } = await getInitialProps(pathname ?? "", searchParams);

  // @ts-expect-error expecting first child to be ReactElement
  const Component = React.Children.toArray(children)[0]?.type;

  const pageDefinition = pathname ? pageDefinitions[pathname] : null;

  Component.getLayout = pageDefinition?.getLayout ?? null;
  const PageWrapper = pageDefinition?.PageWrapper ?? null;

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
      <body>
        {PageWrapper ? (
          <PageWrapper
            Component={Component}
            pageProps={{ session: {} as Session, locale, embedColorScheme, nonce }}>
            {children}
          </PageWrapper>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
