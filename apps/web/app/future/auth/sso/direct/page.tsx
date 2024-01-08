import DirectSSOLogin from "@pages/auth/sso/direct";
import { WithLayout } from "app/layoutHOC";
import type { GetServerSidePropsContext } from "next";

import { samlProductID, samlTenantID } from "@calcom/features/ee/sso/lib/saml";

async function getData(_context: Omit<GetServerSidePropsContext, "res" | "resolvedUrl">) {
  return {
    samlTenantID,
    samlProductID,
  };
}

// @ts-expect-error getData arg
export default WithLayout({ getLayout: null, Page: DirectSSOLogin, getData })<"P">;
