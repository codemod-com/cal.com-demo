import LegacyPage from "@pages/apps/[slug]/[...pages]";
import type { GetServerSidePropsContext } from "next";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import z from "zod";

import { getAppWithMetadata } from "@calcom/app-store/_appRegistry";
import RoutingFormsRoutingConfig from "@calcom/app-store/routing-forms/pages/app-routing.config";
import TypeformRoutingConfig from "@calcom/app-store/typeform/pages/app-routing.config";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import prisma from "@calcom/prisma";
import type { AppGetServerSideProps } from "@calcom/types/AppGetServerSideProps";

import type { AppProps } from "@lib/app-providers";
import { ssrInit } from "app/_trpc/ssrInit";

type AppPageType = {
  getServerSideProps: AppGetServerSideProps;
  // A component than can accept any properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ((props: any) => JSX.Element) &
    Pick<AppProps["Component"], "isBookingPage" | "getLayout" | "PageWrapper">;
};

type Found = {
  notFound: false;
  Component: AppPageType["default"];
  getServerSideProps: AppPageType["getServerSideProps"];
};

const AppsRouting = {
  "routing-forms": RoutingFormsRoutingConfig,
  typeform: TypeformRoutingConfig,
};

const paramsSchema = z.object({
  slug: z.string(),
  pages: z.array(z.string()),
});

function getRoute(appName: string, pages: string[]) {
  const routingConfig = AppsRouting[appName as keyof typeof AppsRouting] as Record<string, AppPageType>;

  if (!routingConfig) {
    notFound();
  }

  const mainPage = pages[0];
  const appPage = routingConfig.layoutHandler || (routingConfig[mainPage] as AppPageType);

  if (!appPage) {
    notFound();
  }

  return { notFound: false, Component: appPage.default, ...appPage } as Found;
}

const getPageProps = async ({ params }: { params: Record<string, string | string[]> }) => {
  const p = paramsSchema.safeParse(params);

  if (!p.success) {
    return notFound();
  }

  const { slug: appName, pages } = p.data;

  const route = getRoute(appName, pages);

  if (route.notFound) {
    return route;
  }

  if (route.getServerSideProps) {
    // TODO: Document somewhere that right now it is just a convention that filename should have appPages in it's name.
    // appPages is actually hardcoded here and no matter the fileName the same variable would be used.
    // We can write some validation logic later on that ensures that [...appPages].tsx file exists
    params.appPages = pages.slice(1);

    // @ts-expect-error pasing headers and cookies should be enough
    const session = await getServerSession({ req: { headers: headers(), cookies: cookies() } });
    const user = session?.user;
    const app = await getAppWithMetadata({ slug: appName });
    if (!app) {
      return {
        notFound: true,
      };
    }

    const result = await route.getServerSideProps(
      {
        params: {
          ...params,
          appPages: pages.slice(1),
        },
      } as GetServerSidePropsContext<{
        slug: string;
        pages: string[];
        appPages: string[];
      }>,
      prisma,
      user,
      ssrInit,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (result.notFound) {
      notFound();
    }

    if (result.redirect) {
      redirect(result.redirect.destination);
    }

    return {
      appName,
      appUrl: app.simplePath || `/apps/${appName}`,
      ...result.props,
    };
  } else {
    return {
      appName,
    };
  }
};

export default async function Page({ params }: { params: Record<string, string | string[]> }) {
  const pageProps = await getPageProps({ params });
  return <LegacyPage {...pageProps} />;
}
