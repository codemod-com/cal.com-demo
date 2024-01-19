import SetNewUserPassword from "@pages/auth/forgot-password/[id]";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cookies, headers } from "next/headers";

import { getLocale } from "@calcom/features/auth/lib/getLocale";
import prisma from "@calcom/prisma";

export const generateMetadata = async () => {
  return await _generateMetadata(
    (t) => t("reset_password"),
    (t) => t("change_your_password")
  );
};

async function getData(context: Omit<GetServerSidePropsContext, "res" | "resolvedUrl">) {
  const id = context.params?.id as string;
  const req = { headers: headers(), cookies: cookies() };

  let resetPasswordRequest = await prisma.resetPasswordRequest.findFirst({
    where: {
      id,
      expires: {
        gt: new Date(),
      },
    },
    select: {
      email: true,
    },
  });
  try {
    resetPasswordRequest &&
      (await prisma.user.findUniqueOrThrow({ where: { email: resetPasswordRequest.email } }));
  } catch (e) {
    resetPasswordRequest = null;
  }
  const locale = await getLocale(req);
  return {
    isRequestExpired: !resetPasswordRequest,
    requestId: id,
    csrfToken: await getCsrfToken({ req: { headers: { cookie: cookies().toString() } } }),
    ...(await serverSideTranslations(locale, ["common"])),
  };
}

// @ts-expect-error getData arg
export default WithLayout({ getLayout: null, Page: SetNewUserPassword, getData })<"P">;
