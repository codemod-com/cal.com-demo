import Page, { getLayout } from "@pages/apps/[slug]/[...pages]";
import type { Params, SearchParams } from "app/_types";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";
import { withAppDirSsr } from "app/withAppDirSsr";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import z from "zod";

import { APP_NAME } from "@calcom/lib/constants";

import { getServerSideProps } from "@lib/apps/[slug]/[...pages]/getServerSideProps";
import { buildLegacyCtx } from "@lib/buildLegacyCtx";

const paramsSchema = z.object({
  slug: z.string(),
  pages: z.array(z.string()),
});

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const p = paramsSchema.safeParse(params);

  if (!p.success) {
    return notFound();
  }

  const mainPage = p.data.pages[0];

  if (mainPage === "forms") {
    return await _generateMetadata(
      () => `Forms | ${APP_NAME}`,
      () => ""
    );
  }

  const legacyCtx = buildLegacyCtx(headers(), cookies(), params, searchParams);

  const { form } = await getData(legacyCtx);

  return await _generateMetadata(
    () => `${form.name} | ${APP_NAME}`,
    () => form.description
  );
};

// @ts-expect-error   Types of parameters 'context' and 'context' are incompatible.
const getData = withAppDirSsr(getServerSideProps);

// @ts-expect-error  getLayout
export default WithLayout({ getData, Page, getLayout });
