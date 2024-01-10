import type { GetStaticProps } from "next";
import { notFound, redirect } from "next/navigation";

import type { buildLegacyCtx } from "@lib/buildLegacyCtx";

export const withAppDirSsg =
  <T extends Record<string, any> | undefined>(getStaticProps: GetStaticProps<NonNullable<T>>) =>
  async (context: ReturnType<typeof buildLegacyCtx>): Promise<T> => {
    const ssgResponse = await getStaticProps(context);

    if ("redirect" in ssgResponse) {
      redirect(ssgResponse.redirect.destination);
    }

    if ("notFound" in ssgResponse) {
      notFound();
    }

    const props = await Promise.resolve(ssgResponse.props);

    return {
      ...ssgResponse.props,
      // includes dehydratedState required for future page trpcPropvider
      ...(typeof props === "object" && "trpcState" in props && { dehydratedState: props.trpcState }),
    };
  };
