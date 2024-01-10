import Page from "@pages/apps/[slug]/index";
import { Prisma } from "@prisma/client";
import { withAppDirSsg } from "app/WithAppDirSsg";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";
import { cookies, headers } from "next/headers";

import { APP_NAME } from "@calcom/lib/constants";
import prisma from "@calcom/prisma";

import { getStaticProps } from "@lib/apps/[slug]/getStaticProps";
import { buildLegacyCtx } from "@lib/buildLegacyCtx";

const getData = withAppDirSsg(getStaticProps);

export const generateMetadata = async ({ params }: { params: Record<string, string | string[]> }) => {
  const legacyContext = buildLegacyCtx(headers(), cookies(), params);
  const { data } = await getData(legacyContext);

  return await _generateMetadata(
    () => `${data.name} | ${APP_NAME}`,
    () => data.description
  );
};

export const generateStaticParams = async () => {
  try {
    const appStore = await prisma.app.findMany({ select: { slug: true } });
    return appStore.map(({ slug }) => ({ slug }));
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientInitializationError) {
      // Database is not available at build time, but that's ok – we fall back to resolving paths on demand
    } else {
      throw e;
    }
  }

  return [];
};

export default WithLayout({ getLayout: null, Page, getData: withAppDirSsg(getStaticProps) });

export const dynamic = "force-static";
