import { useTranslation } from "react-i18next";
import { CallToAction, CallToActionTable } from "../components";
import { OrganizerScheduledEmail } from "./OrganizerScheduledEmail";

export const AttendeeWasRequestedToRescheduleEmail = (
  props: { metadata: { rescheduleLink: string } } & React.ComponentProps<typeof OrganizerScheduledEmail>
) => {
const { t } = useTranslation();

  const t = props.attendee.language.translate;
  return (
    <OrganizerScheduledEmail
      t={t}
      title={t('request-reschedule-booking')}
      subtitle={
        <>
          {t("request_reschedule_subtitle", {
            organizer: props.calEvent.organizer.name,
          })}
        </>
      }
      headerType="calendarCircle"
      subject="rescheduled_event_type_subject"
      callToAction={
        <CallToActionTable>
          <CallToAction label={t('book-a-new-time')} href={props.metadata.rescheduleLink} endIconName="linkIcon" />
        </CallToActionTable>
      }
      {...props}
    />
  );
};
