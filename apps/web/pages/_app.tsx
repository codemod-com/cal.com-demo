import type { AppContextType } from "next/dist/shared/lib/utils";
import React from "react";

import { getLocale } from "@calcom/features/auth/lib/getLocale";
import { trpc } from "@calcom/trpc/react";

import type { AppProps } from "@lib/app-providers";

import "../styles/globals.css";

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  if (Component.PageWrapper !== undefined) return Component.PageWrapper(props);
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (ctx: AppContextType) => {
  const { req } = ctx.ctx;

  let newLocale = "en";

  if (req) {
    newLocale = await getLocale(req);
  } else if (typeof window !== "undefined") {
    const cookies = window.document.cookie.split(";");

    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");

      if (name.trim() === "x-cal-locale") {
        newLocale = value.trim();
        break;
      }
    }
  }

  return {
    pageProps: {
      newLocale,
    },
  };
};

const WrappedMyApp = trpc.withTRPC(MyApp);

export default WrappedMyApp;
