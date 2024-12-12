"use client";
import { useTranslation } from "react-i18next";


import Shell from "@calcom/features/shell/Shell";

import NoPlatformPlan from "@components/settings/platform/dashboard/NoPlatformPlan";
import { useGetUserAttributes } from "@components/settings/platform/hooks/useGetUserAttributes";
import { PlatformPricing } from "@components/settings/platform/pricing/platform-pricing";

export default function PlatformPlans() {
const { t } = useTranslation();

  const { isUserLoading, isUserBillingDataLoading, isPlatformUser, isPaidUser, userBillingData, userOrgId } =
    useGetUserAttributes();

  if (isUserLoading || (isUserBillingDataLoading && !userBillingData)) {
    return <div className="m-5">{t('loading')}</div>;
  }

  if (!isPlatformUser) return <NoPlatformPlan />;

  return (
    <div>
      <Shell
        backPath
        isPlatformUser={true}
        heading={
          <h1 className="mx-2 mt-4 text-center text-xl md:text-2xl">{t('currently-subscribed-to')}{userBillingData?.plan[0]}
            {userBillingData?.plan.slice(1).toLocaleLowerCase()}{t('plan')}</h1>
        }
        withoutMain={false}
        SidebarContainer={<></>}>
        <PlatformPricing teamId={userOrgId} teamPlan={userBillingData?.plan.toLocaleLowerCase()} />
      </Shell>
    </div>
  );
}
