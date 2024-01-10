import TeamPage from "@pages/team/[slug]";
import { withAppDir } from "app/AppDirSSRHOC";
import { _generateMetadata } from "app/_utils";
import type { WithLayoutParams } from "app/layoutHOC";
import { WithLayout } from "app/layoutHOC";

import { getServerSideProps } from "@lib/team/[slug]/getServerSideProps";
import withEmbedSsr from "@lib/withEmbedSsr";

export const generateMetadata = async () =>
  await _generateMetadata(
    // TODO use a simple prisma call to get the organization name
    (t) => t("TODO"),
    (t) => t("TODO")
  );

export default WithLayout({
  Page: TeamPage,
  getData: withAppDir(withEmbedSsr(getServerSideProps)) as WithLayoutParams<any>["getData"],
  getLayout: null,
  isBookingPage: true,
})<"P">;
