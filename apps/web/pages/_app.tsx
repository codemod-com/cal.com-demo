import React from "react";

import { getLocale } from "@calcom/features/auth/lib/getLocale";
import { trpc } from "@calcom/trpc/react";

import type { AppProps } from "@lib/app-providers";

import "../styles/globals.css";

function MyApp(props: AppProps) {
  console.log("MYAPP PROPS", props);
  const { Component, pageProps } = props;
  if (Component.PageWrapper !== undefined) return Component.PageWrapper(props);
  return <Component {...pageProps} newLocale={props.newLocale} />;
}

const WrappedMyApp = trpc.withTRPC(MyApp);

WrappedMyApp.getInitialProps = async (ctx) => {
  const newLocale = await getLocale(ctx.ctx.req);

  return {
    newLocale,
  };
};

export default WrappedMyApp;
