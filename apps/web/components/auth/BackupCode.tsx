import { useTranslation } from "react-i18next";
import React from "react";
import { useFormContext } from "react-hook-form";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Label, TextField } from "@calcom/ui";

export default function TwoFactor({ center = true }) {
const { t } = useTranslation();

  const { t } = useLocale();
  const methods = useFormContext();

  return (
    <div className={center ? "mx-auto !mt-0 max-w-sm" : "!mt-0 max-w-sm"}>
      <Label className="mt-4">{t("backup_code")}</Label>

      <p className="text-subtle mb-4 text-sm">{t("backup_code_instructions")}</p>

      <TextField
        id="backup-code"
        label={t('empty-string-key')}
        defaultValue=""
        placeholder={t('placeholder-xxxxx-xxxxx')}
        minLength={10} // without dash
        maxLength={11} // with dash
        required
        {...methods.register("backupCode")}
      />
    </div>
  );
}
