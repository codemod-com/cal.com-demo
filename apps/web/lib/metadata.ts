import type { Metadata } from "next";

export type MetadataRecipe = Readonly<{
  title: string;
  canonical: string;
  twitterCreator: string;
  twitterSite: string;
  siteName: string;
  image: string;
  description: string;
  robots: {
    index: boolean;
    follow: boolean;
  };
}>;

export const prepareMetadata = (recipe: MetadataRecipe): Metadata => ({
  title: recipe.title,
  alternates: {
    canonical: recipe.canonical,
  },
  icons: {
    icon: "/favicon.icon",
    apple: "/api/logo?type=apple-touch-icon",
    other: [
      {
        rel: "icon-mask",
        url: "/safari-pinned-tab.svg",
        // TODO available in the never Next.js version
        color: "#000000",
      },
      {
        url: "/api/logo?type=favicon-16",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/api/logo?type=favicon-32",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
  robots: recipe.robots,
  other: {
    "application-TileColor": "#ff0000",
  },
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#f9fafb",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#1C1C1C",
    },
  ],
  twitter: {
    site: recipe.twitterSite,
    creator: recipe.twitterCreator,
    card: "summary_large_image",
  },
  openGraph: {
    description: recipe.description,
    url: recipe.canonical,
    type: "website",
    siteName: recipe.siteName,
    title: recipe.title,
    images: [recipe.image],
  },
});

export const generateMetadata = (): Metadata => {
  // get translations

  return prepareMetadata({
    title: "",
    canonical: "",
    tileColor: "#ff0000",
    twitterCreator: "", // @calcom
    twitterSite: "", // @calcom
    siteName: "", // APP_NAME from env vars
    image: "",
    description: "",
    robots: {
      index: false,
      follow: false,
    },
  });
};
