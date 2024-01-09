import type { GetStaticProps } from "next";
import { notFound, redirect } from "next/navigation";

import type { buildLegacyCtx } from "@lib/buildLegacyCtx";

export const withAppDirSsg =
  <T extends Record<string, any>>(getStaticProps: GetStaticProps<T>) =>
  async (context: ReturnType<typeof buildLegacyCtx>): Promise<T> => {
    const ssgResponse = await getStaticProps(context);

    if ("redirect" in ssgResponse) {
      redirect(ssgResponse.redirect.destination);
    }

    if ("notFound" in ssgResponse) {
      notFound();
    }

    return {
      ...ssgResponse.props,
      // includes dehydratedState required for future page trpcPropvider
      ...("trpcState" in ssgResponse.props && { dehydratedState: ssgResponse.props.trpcState }),
    };
  };
