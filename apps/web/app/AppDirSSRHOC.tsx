import type { GetServerSideProps } from "next";
import { notFound, redirect } from "next/navigation";

import type { buildLegacyCtx } from "@lib/buildLegacyCtx";

export const withAppDir =
  (getServerSideProps: GetServerSideProps) => async (context: ReturnType<typeof buildLegacyCtx>) => {
    const ssrResponse = await getServerSideProps(context);

    if ("redirect" in ssrResponse) {
      redirect(ssrResponse.redirect.destination);
    }

    if ("notFound" in ssrResponse) {
      notFound();
    }

    return {
      ...ssrResponse.props,
      // includes dehydratedState required for future page trpcPropvider
      ...("trpcState" in ssrResponse.props && { dehydratedState: ssrResponse.props.trpcState }),
    };
  };
