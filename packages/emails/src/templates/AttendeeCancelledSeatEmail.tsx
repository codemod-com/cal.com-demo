import { useTranslation } from "react-i18next";
import { AttendeeScheduledEmail } from "./AttendeeScheduledEmail";

export const AttendeeCancelledSeatEmail = (props: React.ComponentProps<typeof AttendeeScheduledEmail>) =>  {
const { t } = useTranslation("../../../../tmp/i6o6wu/packages/emails/src/templates");

return (
  <AttendeeScheduledEmail
    title={t('no-longer-attending')}
    headerType="xCircle"
    subject="event_no_longer_attending_subject"
    subtitle=""
    callToAction={null}
    {...props}
  />
)
};
