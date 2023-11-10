import CategoryPage from "@pages/apps/installed/[category]";
import { notFound } from "next/navigation";
import { z } from "zod";

import { AppCategories } from "@calcom/prisma/enums";

const querySchema = z.object({
  category: z.nativeEnum(AppCategories),
});

const getPageProps = async ({ params }: { params: Record<string, string | string[]> }) => {
  const p = querySchema.safeParse(params);

  if (!p.success) {
    return notFound();
  }

  return {
    category: p.data.category,
  };
};

export default async function Page({ params }: { params: Record<string, string | string[]> }) {
  const { category } = await getPageProps({ params });

  return <CategoryPage />;
}
