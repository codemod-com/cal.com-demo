"use client";

import { FiltersContainer } from "@calcom/features/bookings/components/FiltersContainer";
import { ShellMain } from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { HorizontalTabs } from "@calcom/ui";
import type { VerticalTabItemProps, HorizontalTabItemProps } from "@calcom/ui";

const tabs: (VerticalTabItemProps | HorizontalTabItemProps)[] = [
  {
    name: "upcoming",
    href: "/bookings-1/upcoming",
  },
  {
    name: "unconfirmed",
    href: "/bookings-1/unconfirmed",
  },
  {
    name: "recurring",
    href: "/bookings-1/recurring",
  },
  {
    name: "past",
    href: "/bookings-1/past",
  },
  {
    name: "cancelled",
    href: "/bookings-1/cancelled",
  },
];

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();

  return (
    <ShellMain hideHeadingOnMobile heading={t("bookings")} subtitle={t("bookings_description")}>
      <div className="flex flex-col">
        <div className="flex flex-col flex-wrap lg:flex-row">
          <HorizontalTabs tabs={tabs} />
          <div className="max-w-full overflow-x-auto xl:ml-auto">
            <FiltersContainer />
          </div>
        </div>
        <main className="w-full">{children}</main>
      </div>
    </ShellMain>
  );
}
