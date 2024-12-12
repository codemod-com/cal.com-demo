import { useTranslation } from "react-i18next";
import { OrganizerRequestEmail } from "./OrganizerRequestEmail";

export const OrganizerRequestReminderEmail = (props: React.ComponentProps<typeof OrganizerRequestEmail>) =>  {
const { t } = useTranslation();

return (
  <OrganizerRequestEmail title={t('event-still-awaiting-approval')} {...props} />
)
};
