import { useTranslation } from "react-i18next";
import { OrganizerScheduledEmail } from "./OrganizerScheduledEmail";

export const OrganizerAddGuestsEmail = (props: React.ComponentProps<typeof OrganizerScheduledEmail>) =>  {
const { t } = useTranslation("../templates");

return (
  <OrganizerScheduledEmail
    title={t('new-guests-added')}
    headerType="calendarCircle"
    subject="guests_added_event_type_subject"
    callToAction={null}
    {...props}
  />
)
};
