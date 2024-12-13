import { useTranslation } from "react-i18next";
import { AttendeeScheduledEmail } from "./AttendeeScheduledEmail";

export const AttendeeLocationChangeEmail = (props: React.ComponentProps<typeof AttendeeScheduledEmail>) =>  {
const { t } = useTranslation("../../../../tmp/i6o6wu/packages/emails/src/templates");

return (
  <AttendeeScheduledEmail
    title={t('event-location-changed')}
    headerType="calendarCircle"
    subject="location_changed_event_type_subject"
    {...props}
  />
)
};
