import { useTranslation } from "react-i18next";
import React from "react";

import classNames from "@calcom/lib/classNames";

type Props = {
  steps: number;
  currentStep: number;
};

// It might be worth passing this label string from outside the component so we can translate it?
function FormStep({ currentStep, steps }: Props) {
const { t } = useTranslation();

  return (
    <div className="w-full">
      <p className="text-muted text-xs font-medium">{t('step-{current-step}-of-{steps}', { currentStep, steps })}
      </p>
      <div className="flex flex-nowrap space-x-1">
        {[...Array(steps)].map((_, j) => {
          console.log({ j, currentStep });
          return (
            <div
              className={classNames(
                "h-1 w-full rounded-sm",
                currentStep - 1 >= j ? "bg-black" : "bg-gray-400"
              )}
              key={j}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FormStep;
