import { noop } from "lodash";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import type { FC, MouseEventHandler } from "react";
import { Fragment } from "react";

import { PermissionContainer } from "@calcom/features/auth/PermissionContainer";
import { useLocale } from "@calcom/lib/hooks/useLocale";

import classNames from "@lib/classNames";
import type { SVGComponent } from "@lib/types/SVGComponent";

export interface NavTabProps {
  tabs: {
    name: string;
    /** If you want to change the path as per current tab */
    href?: string;
    /** If you want to change query param tabName as per current tab */
    tabName?: string;
    icon?: SVGComponent;
    adminRequired?: boolean;
    className?: string;
  }[];
  linkProps?: Omit<LinkProps, "href">;
}

const NavTabs: FC<NavTabProps> = ({ tabs, linkProps, ...props }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLocale();
  const pathname = usePathname();
  return (
    <>
      <nav
        className="no-scrollbar -mb-px flex space-x-5 overflow-x-scroll rtl:space-x-reverse sm:rtl:space-x-reverse"
        aria-label="Tabs"
        {...props}>
        {tabs.map((tab) => {
          if ((tab.tabName && tab.href) || (!tab.tabName && !tab.href)) {
            throw new Error("Use either tabName or href");
          }
          let href = "";
          let isCurrent;
          if (tab.href) {
            href = tab.href;
            isCurrent = pathname === tab.href;
          } else if (tab.tabName) {
            href = "";
            isCurrent = searchParams?.get("tabName") === tab.tabName;
          }

          const onClick: MouseEventHandler = tab.tabName
            ? (e) => {
                e.preventDefault();

                const urlSearchParams = new URLSearchParams(searchParams ?? undefined);

                if (tab.tabName) {
                  urlSearchParams.set("tabName", tab.tabName);
                }

                router.push(`${pathname}?${urlSearchParams.toString()}`);
              }
            : noop;

          const Component = tab.adminRequired ? PermissionContainer : Fragment;
          const className = tab.className || "";
          return (
            <Component key={tab.name}>
              <Link key={tab.name} href={href} {...linkProps} legacyBehavior>
                <a
                  onClick={onClick}
                  className={classNames(
                    isCurrent
                      ? "text-emphasis border-gray-900"
                      : "hover:border-default hover:text-default text-subtle border-transparent",
                    "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium",
                    className
                  )}
                  aria-current={isCurrent ? "page" : undefined}>
                  {tab.icon && (
                    <tab.icon
                      className={classNames(
                        isCurrent ? "text-emphasis" : "group-hover:text-subtle text-muted",
                        "-ml-0.5 hidden h-4 w-4 ltr:mr-2 rtl:ml-2 sm:inline-block"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <span>{t(tab.name)}</span>
                </a>
              </Link>
            </Component>
          );
        })}
      </nav>
      <hr className="border-subtle" />
    </>
  );
};

export default NavTabs;
