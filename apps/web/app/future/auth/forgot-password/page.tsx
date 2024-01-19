import ForgotPassword from "@pages/auth/forgot-password";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getLocale } from "@calcom/features/auth/lib/getLocale";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

export const generateMetadata = async () => {
  return await _generateMetadata(
    (t) => t("reset_password"),
    (t) => t("change_your_password")
  );
};

async function getData(_context: Omit<GetServerSidePropsContext, "res" | "resolvedUrl">) {
  const req = { headers: headers(), cookies: cookies() };

  // @ts-expect-error Type '{ headers: ReadonlyHeaders; cookies: ReadonlyRequestCookies; }' is not assignable to type 'NextApiRequest | IncomingMessage
  const session = await getServerSession({ req });

  if (session) {
    redirect("/");
    // window.location.href = "/"
    return {};
  }
  const locale = await getLocale(req);

  return {
    csrfToken: await getCsrfToken({ req: { headers: { cookie: cookies().toString() } } }),
    ...(await serverSideTranslations(locale, ["common"])),
  };
}

// @ts-expect-error getData arg
export default WithLayout({ getLayout: null, Page: ForgotPassword, getData })<"P">;
