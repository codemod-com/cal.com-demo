import { useTranslation } from "react-i18next";
import React from "react";

const NotFound = () => {
const { t } = useTranslation();

  return (
    <div data-testid="404-page">
      <h1>{t('404-page-not-found')}</h1>
      <p>{t('sorry-the-page-you-are-looking-for-does-not-exist')}</p>
    </div>
  );
};

export default NotFound;
