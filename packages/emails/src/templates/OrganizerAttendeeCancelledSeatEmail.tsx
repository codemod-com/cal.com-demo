import { useTranslation } from "react-i18next";
import { OrganizerScheduledEmail } from "./OrganizerScheduledEmail";

export const OrganizerAttendeeCancelledSeatEmail = (
  props: React.ComponentProps<typeof OrganizerScheduledEmail>
) =>  {
const { t } = useTranslation("../../../../tmp/i6o6wu/packages/emails/src/templates");

return (
  <OrganizerScheduledEmail
    title={t('attendee-no-longer-attending')}
    headerType="xCircle"
    subject="event_cancelled_subject"
    callToAction={null}
    attendeeCancelled
    {...props}
  />
)
};
