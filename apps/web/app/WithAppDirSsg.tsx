import type { GetStaticProps } from "next";
import { notFound, redirect } from "next/navigation";

import type { buildLegacyCtx } from "@lib/buildLegacyCtx";

export const withAppDirSsg =
  <T extends Record<string, any>>(getStaticProps: GetStaticProps<T>) =>
  async (context: ReturnType<typeof buildLegacyCtx>) => {
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
      ...("trpcState" in props && { dehydratedState: props.trpcState }),
    };
  };
