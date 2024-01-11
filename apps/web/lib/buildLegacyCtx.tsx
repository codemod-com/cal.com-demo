import { type Params } from "app/_types";
import type { GetServerSidePropsContext } from "next";
import { type ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { type ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// returns query object same as ctx.query but for app dir
export const getQuery = (url: string, params: Params) => {
  if (!url.length) {
    return params;
  }

  const { searchParams } = new URL(url);
  const searchParamsObj = Object.fromEntries(searchParams.entries());

  return { ...searchParamsObj, ...params };
};

export const buildLegacyCtx = (headers: ReadonlyHeaders, cookies: ReadonlyRequestCookies, params: Params) => {
  const legacyHeaders = Array.from(headers.keys()).reduce(
    (acc, key) => ({ ...acc, key: headers.get(key)! }),
    {} as Record<string, string | string[]>
  );
  const legacyCookies = cookies
    .getAll()
    .reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {} as Record<string, string>);

  return {
    query: getQuery(headers.get("x-url") ?? "", params),
    params,
    req: { headers: legacyHeaders, cookies: legacyCookies },
  } as GetServerSidePropsContext;
};
