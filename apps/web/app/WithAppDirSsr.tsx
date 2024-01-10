import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { notFound, redirect } from "next/navigation";

export const withAppDirSsr =
  <T extends Record<string, any> | undefined>(getServerSideProps: GetServerSideProps<NonNullable<T>>) =>
  async (context: GetServerSidePropsContext): Promise<T> => {
    const ssrResponse = await getServerSideProps(context);

    if ("redirect" in ssrResponse) {
      redirect(ssrResponse.redirect.destination);
    }

    if ("notFound" in ssrResponse) {
      notFound();
    }

    const props = await Promise.resolve(ssrResponse.props);

    return {
      ...props,
      // includes dehydratedState required for future page trpcPropvider
      ...("trpcState" in props && { dehydratedState: props.trpcState }),
    };
  };
