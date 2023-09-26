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
  console.log("GET_INITIAL_PROPS_MY_APP_ENTERING");
  const { req } = ctx.ctx;

  let newLocale = "pl";

  if (req) {
    newLocale = await getLocale(req);
  } else if (typeof window !== "undefined") {
    const lang = window.document.getElementsByTagName("html")[0]?.lang;

    console.log("lang", lang);

    if (lang) {
      newLocale = lang;
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
