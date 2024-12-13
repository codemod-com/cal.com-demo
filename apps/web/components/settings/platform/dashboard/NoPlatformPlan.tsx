import { useTranslation } from "react-i18next";
import { EmptyScreen, Button } from "@calcom/ui";

export default function NoPlatformPlan() {
const { t } = useTranslation("../../../tmp/i6o6wu/apps/web/components/settings/platform/dashboard");

  return (
    <EmptyScreen
      Icon="credit-card"
      headline="Subscription needed"
      description={t('you-are-not-subscribed-to-a-platform-plan')}
      buttonRaw={
        <div className="flex gap-2">
          <Button
            className="hover:bg-slate-300 hover:text-black"
            color="secondary"
            href="/settings/platform/new">{t('subscribe')}</Button>
          <Button
            color="secondary"
            className="hover:bg-slate-300 hover:text-black"
            href="https://cal.com/platform/pricing"
            target="_blank">{t('go-to-pricing')}</Button>
          <Button
            color="secondary"
            className="hover:bg-slate-300 hover:text-black"
            href="https://cal.com/sales"
            target="_blank">{t('contact-sales')}</Button>
        </div>
      }
    />
  );
}
