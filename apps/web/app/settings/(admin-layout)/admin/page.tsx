import { useTranslation } from "react-i18next";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("admin"),
    () => ""
  );

const Page = () =>  {
const { t } = useTranslation();

return <h1>{t('admin-index')}</h1>
};
export default Page;
