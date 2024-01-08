import Provider from "@pages/auth/sso/[provider]";
import { ssrInit } from "app/_trpc/ssrInit";
import { WithLayout } from "app/layoutHOC";
import type { GetServerSidePropsContext } from "next";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getPremiumMonthlyPlanPriceId } from "@calcom/app-store/stripepayment/lib/utils";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { getOrgDomainConfigFromHostname } from "@calcom/features/ee/organizations/lib/orgDomains";
import stripe from "@calcom/features/ee/payments/server/stripe";
import { hostedCal, isSAMLLoginEnabled, samlProductID, samlTenantID } from "@calcom/features/ee/sso/lib/saml";
import { ssoTenantProduct } from "@calcom/features/ee/sso/lib/sso";
import { IS_PREMIUM_USERNAME_ENABLED } from "@calcom/lib/constants";
import { checkUsername } from "@calcom/lib/server/checkUsername";
import prisma from "@calcom/prisma";

import { asStringOrNull } from "@lib/asStringOrNull";

function orgDomainConfig(
  req: { headers: ReadonlyHeaders; cookies: ReadonlyRequestCookies },
  fallback?: string | string[]
) {
  const forcedSlug = req?.headers?.get("x-cal-force-slug") ?? "";

  const hostname = req?.headers?.get("host") ?? "";
  return getOrgDomainConfigFromHostname({
    hostname,
    fallback,
    forcedSlug,
  });
}

async function getData(context: Omit<GetServerSidePropsContext, "res" | "resolvedUrl">) {
  const { query } = context;
  const req = { headers: headers(), cookies: cookies() };

  // get query params and typecast them to string
  // (would be even better to assert them instead of typecasting)
  const providerParam = asStringOrNull(query.provider);
  const emailParam = asStringOrNull(query.email);
  const usernameParam = asStringOrNull(query.username);
  const successDestination = `/getting-started${usernameParam ? `?username=${usernameParam}` : ""}`;
  if (!providerParam) {
    throw new Error(`File is not named sso/[provider]`);
  }

  // @ts-expect-error Type '{ headers: ReadonlyHeaders; cookies: ReadonlyRequestCookies; }' is not assignable to type 'NextApiRequest | IncomingMessage
  const session = await getServerSession({ req });
  const ssr = await ssrInit();
  const { currentOrgDomain } = orgDomainConfig(req);

  if (session) {
    // Validating if username is Premium, while this is true an email its required for stripe user confirmation
    if (usernameParam && session.user.email) {
      const availability = await checkUsername(usernameParam, currentOrgDomain);
      if (availability.available && availability.premium && IS_PREMIUM_USERNAME_ENABLED) {
        const stripePremiumUrl = await getStripePremiumUsernameUrl({
          userEmail: session.user.email,
          username: usernameParam,
          successDestination,
        });
        if (stripePremiumUrl) {
          return redirect(stripePremiumUrl);
        }
      }
    }

    return redirect(successDestination);
  }

  let error: string | null = null;

  let tenant = samlTenantID;
  let product = samlProductID;

  if (providerParam === "saml" && hostedCal) {
    if (!emailParam) {
      error = "Email not provided";
    } else {
      try {
        const ret = await ssoTenantProduct(prisma, emailParam);
        tenant = ret.tenant;
        product = ret.product;
      } catch (e) {
        if (e instanceof Error) {
          error = e.message;
        }
      }
    }
  }

  if (error) {
    return redirect(`/auth/error?error=${error}`);
  }

  return {
    trpcState: ssr.dehydrate(),
    provider: providerParam,
    isSAMLLoginEnabled,
    hostedCal,
    tenant,
    product,
    error,
  };
}

type GetStripePremiumUsernameUrl = {
  userEmail: string;
  username: string;
  successDestination: string;
};

const getStripePremiumUsernameUrl = async ({
  userEmail,
  username,
  successDestination,
}: GetStripePremiumUsernameUrl): Promise<string | null> => {
  // @TODO: probably want to check if stripe user email already exists? or not
  const customer = await stripe.customers.create({
    email: userEmail,
    metadata: {
      email: userEmail,
      username,
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: customer.id,
    line_items: [
      {
        price: getPremiumMonthlyPlanPriceId(),
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_WEBAPP_URL}${successDestination}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: process.env.NEXT_PUBLIC_WEBAPP_URL || "https://app.cal.com",
    allow_promotion_codes: true,
  });

  return checkoutSession.url;
};

// @ts-expect-error getData arg
export default WithLayout({ getLayout: null, Page: Provider, getData })<"P">;
