import { useTranslation } from "react-i18next";
import { OrganizerScheduledEmail } from "./OrganizerScheduledEmail";

export const OrganizerReassignedEmail = (props: React.ComponentProps<typeof OrganizerScheduledEmail>) => {
const { t } = useTranslation();

  const t = props.teamMember?.language.translate || props.calEvent.organizer.language.translate;
  return (
    <OrganizerScheduledEmail
      title={t('event-request-reassigned')}
      headerType="xCircle"
      subject="event_reassigned_subject"
      subtitle={<>{t("event_reassigned_subtitle")}</>}
      callToAction={null}
      reassigned={props.reassigned}
      {...props}
    />
  );
};
