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

  console.log("AAAA", Boolean(req), Boolean(ctx.ctx.res));

  const newLocale = req ? await getLocale(req) : "en";

  return {
    pageProps: {
      newLocale,
    },
  };
};

const WrappedMyApp = trpc.withTRPC(MyApp);

export default WrappedMyApp;
