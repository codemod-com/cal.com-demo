import { useTranslation } from "react-i18next";
import { BaseEmailHtml, Info } from "../components";

export interface Feedback {
  username: string;
  email: string;
  rating: string;
  comment: string;
}

export const FeedbackEmail = (props: Feedback & Partial<React.ComponentProps<typeof BaseEmailHtml>>) => {
const { t } = useTranslation("../templates");

  return (
    <BaseEmailHtml subject="Feedback" title="Feedback">
      <Info label={t('username-label')} description={props.username} withSpacer />
      <Info label={t('email-label')} description={props.email} withSpacer />
      <Info label={t('rating-label')} description={props.rating} withSpacer />
      <Info label={t('comment-label')} description={props.comment} withSpacer />
    </BaseEmailHtml>
  );
};
