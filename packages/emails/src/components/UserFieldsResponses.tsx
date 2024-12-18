import { I18nextProvider } from "react-i18next";
import { i18n } from "./i18n";
import type { TFunction } from "next-i18next";

import getLabelValueMapFromResponses from "@calcom/lib/getLabelValueMapFromResponses";
import type { CalendarEvent } from "@calcom/types/Calendar";

import { Info } from "./Info";

export function UserFieldsResponses(props: { calEvent: CalendarEvent; t: TFunction; isOrganizer?: boolean }) {
  const { t, isOrganizer = false } = props;
  const labelValueMap = getLabelValueMapFromResponses(props.calEvent, isOrganizer);

  if (!labelValueMap) return null;
  return (
    <I18nextProvider i18n={i18n}>
<>
      {Object.keys(labelValueMap).map((key) =>
        labelValueMap[key] !== "" ? (
          <Info
            key={key}
            label={t(key)}
            description={
              typeof labelValueMap[key] === "boolean"
                ? labelValueMap[key]
                  ? t("yes")
                  : t("no")
                : `${labelValueMap[key] ? labelValueMap[key] : ""}`
            }
            withSpacer
            isLabelHTML
          />
        ) : null
      )}
    </>
</I18nextProvider>
  );
}
