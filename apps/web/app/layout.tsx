import type { Metadata } from "next";
import Script from "next/script";

import { IS_PRODUCTION } from "@calcom/lib/constants";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        {!IS_PRODUCTION && process.env.VERCEL_ENV === "preview" && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <Script
            data-project-id="KjpMrKTnXquJVKfeqmjdTffVPf1a6Unw2LZ58iE4"
            src="https://snippet.meticulous.ai/v1/stagingMeticulousSnippet.js"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
