import { create } from "./getFixedT";

export const getTranslation = async (locale: string, ns: string) => {
  const _i18n = await create(locale, ns);
  return _i18n.getFixedT(locale, ns);
};
