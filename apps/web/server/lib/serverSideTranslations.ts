import { serverSideTranslations as _serverSideTranslations } from "next-i18next/serverSideTranslations";

import config from "../../next-i18next.config";

export const serverSideTranslations: typeof _serverSideTranslations = async (locale, namespaces) => {
  return _serverSideTranslations(locale, namespaces, config);
};
