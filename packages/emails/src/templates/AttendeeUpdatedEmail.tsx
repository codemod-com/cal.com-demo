import { useTranslation } from "react-i18next";
import { AttendeeScheduledEmail } from "./AttendeeScheduledEmail";

export const AttendeeUpdatedEmail = (props: React.ComponentProps<typeof AttendeeScheduledEmail>) =>  {
const { t } = useTranslation("../templates");

return (
  <AttendeeScheduledEmail
    title={t('event-has-been-updated')}
    headerType="calendarCircle"
    subject="event_type_has_been_updated"
    {...props}
  />
)
};
