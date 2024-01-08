"use server";

import type { DehydratedState } from "@tanstack/react-query";
import { ssrInit } from "app/_trpc/ssrInit";
import { jwtVerify } from "jose";
import { getCsrfToken } from "next-auth/react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { isSAMLLoginEnabled, samlProductID, samlTenantID } from "@calcom/features/ee/sso/lib/saml";
import { WEBSITE_URL } from "@calcom/lib/constants";
import { getSafeRedirectUrl } from "@calcom/lib/getSafeRedirectUrl";
import prisma from "@calcom/prisma";

import type { buildLegacyCtx } from "@lib/buildLegacyCtx";

import { IS_GOOGLE_LOGIN_ENABLED } from "@server/lib/constants";

export async function getData(
  context: ReturnType<typeof buildLegacyCtx>,
  getTrpcState: () => Promise<DehydratedState>,
  trpcStateKey: "trpcState" | "dehydratedState"
) {
  const { query } = context;
  const ssr = await ssrInit();
  const req = { headers: headers(), cookies: cookies() };

  // @ts-expect-error Type '{ headers: ReadonlyHeaders; cookies: ReadonlyRequestCookies; }' is not assignable to type 'NextApiRequest | IncomingMessage
  const session = await getServerSession({ req });

  const verifyJwt = (jwt: string) => {
    const secret = new TextEncoder().encode(process.env.CALENDSO_ENCRYPTION_KEY);

    return jwtVerify(jwt, secret, {
      issuer: WEBSITE_URL,
      audience: `${WEBSITE_URL}/auth/login`,
      algorithms: ["HS256"],
    });
  };

  let totpEmail = null;
  if (context.query.totp) {
    try {
      const decryptedJwt = await verifyJwt(context.query.totp as string);
      if (decryptedJwt.payload) {
        totpEmail = decryptedJwt.payload.email as string;
      } else {
        return redirect("/auth/error?error=JWT%20Invalid%20Payload");
      }
    } catch (e) {
      return redirect("/auth/error?error=Invalid%20JWT%3A%20Please%20try%20again");
    }
  }

  if (session) {
    const { callbackUrl } = query;

    if (callbackUrl) {
      try {
        const destination = getSafeRedirectUrl(callbackUrl as string);
        if (destination) {
          return redirect(destination);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    return redirect("/");
  }

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    // Proceed to new onboarding to create first admin user
    return redirect("/auth/setup");
  }

  return {
    props: {
      csrfToken: await getCsrfToken({ req: { headers: { cookie: cookies().toString() } } }),
      [trpcStateKey]: await getTrpcState(),
      trpcState: ssr.dehydrate(),
      isGoogleLoginEnabled: IS_GOOGLE_LOGIN_ENABLED,
      isSAMLLoginEnabled,
      samlTenantID,
      samlProductID,
      totpEmail,
    },
  };
}
