import { useTranslation } from "react-i18next";
import { OrganizerScheduledEmail } from "./OrganizerScheduledEmail";

export const OrganizerLocationChangeEmail = (props: React.ComponentProps<typeof OrganizerScheduledEmail>) =>  {
const { t } = useTranslation("../../../../tmp/i6o6wu/packages/emails/src/templates");

return (
  <OrganizerScheduledEmail
    title={t('event-location-changed')}
    headerType="calendarCircle"
    subject="location_changed_event_type_subject"
    callToAction={null}
    {...props}
  />
)
};
