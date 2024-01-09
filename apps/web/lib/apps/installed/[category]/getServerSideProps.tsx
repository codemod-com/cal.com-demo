import { z } from "zod";

import { AppCategories } from "@calcom/prisma/enums";
import type { AppGetServerSidePropsContext } from "@calcom/types/AppGetServerSideProps";

export type querySchemaType = z.infer<typeof querySchema>;

export const querySchema = z.object({
  category: z.nativeEnum(AppCategories),
});

export async function getServerSideProps(ctx: AppGetServerSidePropsContext) {
  // get return-to cookie and redirect if needed
  const { cookies } = ctx.req;
  if (cookies && cookies["return-to"]) {
    const returnTo = cookies["return-to"];
    if (returnTo) {
      ctx.res.setHeader("Set-Cookie", "return-to=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
      return {
        redirect: {
          destination: `${returnTo}`,
          permanent: false,
        },
      };
    }
  }
  const params = querySchema.safeParse(ctx.params);

  if (!params.success) return { notFound: true };

  return {
    props: {
      category: params.data.category,
    },
  };
}
