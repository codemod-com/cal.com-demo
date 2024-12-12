import { useTranslation } from "react-i18next";
import { CallToAction, CallToActionTable } from "../components";
import { AttendeeScheduledEmail } from "./AttendeeScheduledEmail";

function ManageLink(props: React.ComponentProps<typeof AttendeeScheduledEmail>) {
  const manageText = props.attendee.language.translate("pay_now");

  if (!props.calEvent.paymentInfo?.link) return null;

  return (
    <CallToActionTable>
      <CallToAction label={manageText} href={props.calEvent.paymentInfo.link} endIconName="linkIcon" />
    </CallToActionTable>
  );
}

export const AttendeeAwaitingPaymentEmail = (props: React.ComponentProps<typeof AttendeeScheduledEmail>) => {
const { t } = useTranslation();

  return props.calEvent.paymentInfo?.paymentOption === "HOLD" ? (
    <AttendeeScheduledEmail
      title={t('meeting-awaiting-payment-method')}
      headerType="calendarCircle"
      subject="awaiting_payment_subject"
      callToAction={<ManageLink {...props} />}
      {...props}
    />
  ) : (
    <AttendeeScheduledEmail
      title={t('meeting-awaiting-payment')}
      headerType="calendarCircle"
      subject="awaiting_payment_subject"
      callToAction={<ManageLink {...props} />}
      {...props}
    />
  );
};
