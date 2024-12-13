import { useTranslation } from "react-i18next";
import { AttendeeScheduledEmail } from "./AttendeeScheduledEmail";

export const AttendeeCancelledEmail = (props: React.ComponentProps<typeof AttendeeScheduledEmail>) =>  {
const { t } = useTranslation("../../../../tmp/i6o6wu/packages/emails/src/templates");

return (
  <AttendeeScheduledEmail
    title={t('event-request-cancelled')}
    headerType="xCircle"
    subject="event_cancelled_subject"
    callToAction={null}
    {...props}
  />
)
};
