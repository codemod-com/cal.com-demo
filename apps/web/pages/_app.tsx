import React from "react";

import { trpc } from "@calcom/trpc/react";

import type { AppProps } from "@lib/app-providers";

import "../styles/globals.css";

function MyApp(props: AppProps) {
  console.log("MYAPP PROPS", props);
  const { Component, pageProps } = props;
  if (Component.PageWrapper !== undefined) return Component.PageWrapper(props);
  return <Component {...pageProps} newLocale={props.newLocale} />;
}

const X = trpc.withTRPC(MyApp);

X.getInitialProps = async (ctx) => {
  console.log(ctx.req);
  const cookie = ctx.req?.headers["cookie"];
  const authorization = ctx.req?.headers["authorization"];

  console.log(cookie, authorization);

  const newLocale = "fr";

  return {
    newLocale,
  };
};

export default X;
