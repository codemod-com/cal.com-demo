import config from "next-i18next.config";
import { serverSideTranslations as _serverSideTranslations } from "next-i18next/serverSideTranslations";

export const serverSideTranslations: typeof _serverSideTranslations = async (locale, namespaces) => {
  return _serverSideTranslations(locale, namespaces, config);
};
