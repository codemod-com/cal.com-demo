import type { GetServerSidePropsResult } from "next";
import { notFound, redirect } from "next/navigation";

export const mapGetServerSidePropsResultForAppDir = async <P extends { [key: string]: unknown }>(
  result: GetServerSidePropsResult<P>
) => {
  if ("redirect" in result) {
    redirect(result.redirect.destination);
  }

  if ("notFound" in result) {
    notFound();
  }

  return result.props;
};
