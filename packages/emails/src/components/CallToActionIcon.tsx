import { useTranslation } from "react-i18next";
import React from "react";

import { WEBAPP_URL } from "@calcom/lib/constants";

export const CallToActionIcon = ({ iconName, style }: { iconName: string; style?: React.CSSProperties }) =>  {
const { t } = useTranslation("");

return (
  <img
    src={`${WEBAPP_URL}/emails/${iconName}.png`}
    srcSet={`${WEBAPP_URL}/emails/${iconName}.svg`}
    width="1rem"
    style={{
      height: "1rem",
      width: "1rem",
      marginLeft: "0.5rem",
      ...style,
    }}
    alt={t('empty-string')}
  />
)
};
