import { useTranslation } from "react-i18next";
import classNames from "@calcom/lib/classNames";

export default function Logo({
  small,
  icon,
  inline = true,
  className,
  src = "/api/logo",
}: {
  small?: boolean;
  icon?: boolean;
  inline?: boolean;
  className?: string;
  src?: string;
}) {
const { t } = useTranslation("../../../tmp/i6o6wu/packages/ui/components/logo");

  return (
    <h3 className={classNames("logo", inline && "inline", className)}>
      <strong>
        {icon ? (
          <img className="mx-auto w-9 dark:invert" alt={t('cal-fragment-0')} title={t('cal-fragment-1')} src={`${src}?type=icon`} />
        ) : (
          <img
            className={classNames(small ? "h-4 w-auto" : "h-5 w-auto", "dark:invert")}
            alt={t('cal-fragment-2')}
            title={t('cal-fragment-3')}
            src={src}
          />
        )}
      </strong>
    </h3>
  );
}
