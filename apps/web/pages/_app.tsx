import React from "react";

import { trpc } from "@calcom/trpc/react";

import type { AppProps } from "@lib/app-providers";

import "../styles/globals.css";

function MyApp(props: AppProps) {
  console.log("XXX1", props.newLocale);
  const { Component, pageProps } = props;
  // HERE
  if (Component.PageWrapper !== undefined) return Component.PageWrapper(props);
  return <Component {...pageProps} />;
}

export default trpc.withTRPC(MyApp);
