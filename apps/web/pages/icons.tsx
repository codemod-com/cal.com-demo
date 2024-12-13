"use client";
import { useTranslation } from "react-i18next";


import type { InferGetStaticPropsType } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Head from "next/head";

import { APP_NAME } from "@calcom/lib/constants";
import type { IconName } from "@calcom/ui";
import { Icon, IconSprites } from "@calcom/ui";

import { lucideIconList } from "../../../packages/ui/components/icon/icon-list.mjs";

const interFont = Inter({ subsets: ["latin"], variable: "--font-inter", preload: true, display: "swap" });
const calFont = localFont({
  src: "../fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal",
  preload: true,
  display: "swap",
  weight: "600",
});

export const getStaticProps = async () => {
  return {
    props: {
      icons: Array.from(lucideIconList).sort() as IconName[],
    },
  };
};

const IconGrid = (props: {
  title: string;
  icons: IconName[];
  rootClassName?: string;
  iconClassName?: string;
}) => (
  <div className={props.rootClassName}>
    <h2 className="font-cal mt-6 text-lg font-medium">{props.title}</h2>
    <div className="grid grid-cols-2 lg:grid-cols-6">
      {props.icons.map((icon) => {
        return (
          <div key={icon} className="flex items-center gap-1">
            <Icon name={icon} className={props.iconClassName} />
            <div>{icon}</div>
          </div>
        );
      })}
    </div>
  </div>
);

export default function IconsPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
const { t } = useTranslation("../../../tmp/i6o6wu/apps/web/pages");

  return (
    <div className="bg-subtle flex h-screen">
      <Head>
        <title>{t('icon-showcase-app-name', { APP_NAME })}</title>
      </Head>
      <style jsx global>{`
        :root {
          --font-cal: ${calFont.style.fontFamily};
          --font-inter: ${interFont.style.fontFamily};
        }
      `}</style>
      <IconSprites />
      <div className="bg-default m-auto min-w-full rounded-md p-10 text-right ltr:text-left">
        <h1 className="text-emphasis font-cal text-2xl font-medium">{t('icons-showcase')}</h1>
        <IconGrid title={t('regular-icons')} icons={props.icons} />
        <IconGrid
          title={t('filled-icons')}
          icons={props.icons}
          rootClassName="bg-darkgray-100 text-gray-50"
          iconClassName="fill-blue-500"
        />
      </div>
    </div>
  );
}
