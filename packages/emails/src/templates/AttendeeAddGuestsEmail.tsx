import { useTranslation } from "react-i18next";
import { AttendeeScheduledEmail } from "./AttendeeScheduledEmail";

export const AttendeeAddGuestsEmail = (props: React.ComponentProps<typeof AttendeeScheduledEmail>) =>  {
const { t } = useTranslation("../../../../tmp/i6o6wu/packages/emails/src/templates");

return (
  <AttendeeScheduledEmail
    title={t('new-guests-added')}
    headerType="calendarCircle"
    subject="guests_added_event_type_subject"
    {...props}
  />
)
};
