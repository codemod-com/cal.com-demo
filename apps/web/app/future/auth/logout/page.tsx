import Logout from "@pages/auth/logout";
import { ssrInit } from "app/_trpc/ssrInit";
import { WithLayout } from "app/layoutHOC";
import type { GetServerSidePropsContext } from "next";
import { cookies } from "next/headers";

async function getData(context: Omit<GetServerSidePropsContext, "res" | "resolvedUrl">) {
  const ssr = await ssrInit();
  // Deleting old cookie manually, remove this code after all existing cookies have expired

  cookies().delete("next-auth.session-token");

  return {
    trpcState: ssr.dehydrate(),
    query: context.query,
  };
}

// @ts-expect-error getData arg
export default WithLayout({ getLayout: null, Page: Logout, getData })<"P">;
