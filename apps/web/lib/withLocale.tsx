import type { GetServerSideProps } from "next";

import { getLocale } from "@calcom/features/auth/lib/getLocale";

export type WithLocaleProps<T extends Record<string, unknown>> = T & {
  newLocale: string;
};

export const withLocale = <T extends Record<string, unknown>>(
  getServerSideProps: GetServerSideProps<T>
): GetServerSideProps<WithLocaleProps<T>> => {
  return async (context) => {
    const result = await getServerSideProps(context);

    if (!("props" in result)) {
      return result;
    }

    const resultProps = await Promise.resolve(result.props);

    const newLocale = await getLocale(context.req);

    return {
      props: {
        ...resultProps,
        newLocale,
      },
    };
  };
};
