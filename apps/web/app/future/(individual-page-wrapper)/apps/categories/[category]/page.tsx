import CategoryPage from "@pages/apps/categories/[category]";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import z from "zod";

import { getAppRegistry } from "@calcom/app-store/_appRegistry";
import prisma from "@calcom/prisma";
import { AppCategories } from "@calcom/prisma/enums";

export const getStaticParams = async () => {
  const paths = Object.keys(AppCategories);

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientInitializationError) {
      // Database is not available at build time. Make sure we fall back to building these pages on demand
      return [];
    } else {
      throw e;
    }
  }

  return paths.map((category) => ({ category }));
};

const querySchema = z.object({
  category: z.nativeEnum(AppCategories),
});

const getPageProps = async ({ params }: { params: Record<string, string | string[]> }) => {
  const p = querySchema.safeParse(params);

  if (!p.success) {
    return notFound();
  }

  const appQuery = await prisma.app.findMany({
    where: {
      categories: {
        has: p.data.category,
      },
    },
    select: {
      slug: true,
    },
  });

  const dbAppsSlugs = appQuery.map((category) => category.slug);

  const appStore = await getAppRegistry();

  const apps = appStore.filter((app) => dbAppsSlugs.includes(app.slug));
  return {
    apps,
  };
};

export default async function Page({ params }: { params: Record<string, string | string[]> }) {
  const { apps } = await getPageProps({ params });
  return <CategoryPage apps={apps} />;
}

export const dynamic = "force-static";
