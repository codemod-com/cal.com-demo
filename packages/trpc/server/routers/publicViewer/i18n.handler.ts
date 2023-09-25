import type { NextApiRequest, NextApiResponse } from "next";

import { getLocale } from "@calcom/features/auth/lib/getServerSession";

import type { WithLocale } from "../../createContext";
import type { I18nInputSchema } from "./i18n.schema";

type I18nOptions = {
  ctx: WithLocale & {
    req: NextApiRequest | undefined;
    res: NextApiResponse | undefined;
  };
  input: I18nInputSchema;
};

export const i18nHandler = async ({ ctx }: I18nOptions) => {
  const locale = await getLocale(ctx.req);
  const { serverSideTranslations } = await import("next-i18next/serverSideTranslations");
  const i18n = await serverSideTranslations(locale, ["common", "vital"]);

  return {
    i18n,
    locale,
  };
};

export default i18nHandler;
