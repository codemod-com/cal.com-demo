import signin from "@pages/auth/signin";
import { WithLayout } from "app/layoutHOC";
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken, getProviders } from "next-auth/react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

async function getData(_context: Omit<GetServerSidePropsContext, "res" | "resolvedUrl">) {
  const req = { headers: headers(), cookies: cookies() };

  // @ts-expect-error Type '{ headers: ReadonlyHeaders; cookies: ReadonlyRequestCookies; }' is not assignable to type 'NextApiRequest | IncomingMessage
  const session = await getServerSession({ req });
  const csrfToken = await getCsrfToken({ req: { headers: { cookie: req.cookies.toString() } } });
  const providers = await getProviders();
  if (session) {
    return redirect("/");
  }
  return {
    csrfToken,
    providers,
  };
}

// @ts-expect-error getData arg
export default WithLayout({ getLayout: null, Page: signin, getData })<"P">;
