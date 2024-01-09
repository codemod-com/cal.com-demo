import Page from "@pages/apps/[slug]/index";
import { Prisma } from "@prisma/client";
import { withAppDirSsr } from "app/WithAppDirSsr";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";

import { APP_NAME } from "@calcom/lib/constants";
import prisma from "@calcom/prisma";

import { getStaticProps } from "@lib/apps/[slug]/getStaticProps";

const getData = withAppDirSsr(getStaticProps);

export const generateMetadata = async ({ params }: { params: Record<string, string | string[]> }) => {
  const { data } = await getData({ params });

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

export default WithLayout({ getLayout: null, Page, getData: withAppDirSsr(getStaticProps) });

export const dynamic = "force-static";
