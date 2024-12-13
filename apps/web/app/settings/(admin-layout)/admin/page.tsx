import { useTranslation } from "react-i18next";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("admin"),
    () => ""
  );

const Page = () =>  {
const { t } = useTranslation("../../../tmp/i6o6wu/apps/web/app/settings/(admin-layout)/admin");

return <h1>{t('admin-index')}</h1>
};
export default Page;
