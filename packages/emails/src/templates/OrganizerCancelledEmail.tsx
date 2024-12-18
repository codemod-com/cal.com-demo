import { useTranslation } from "react-i18next";
import { OrganizerScheduledEmail } from "./OrganizerScheduledEmail";

export const OrganizerCancelledEmail = (props: React.ComponentProps<typeof OrganizerScheduledEmail>) =>  {
const { t } = useTranslation("../templates");

return (
  <OrganizerScheduledEmail
    title={t('event-request-cancelled')}
    headerType="xCircle"
    subject="event_cancelled_subject"
    callToAction={null}
    {...props}
  />
)
};
