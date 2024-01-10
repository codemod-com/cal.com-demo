import LegacyPage, { getServerSideProps as _getServerSideProps } from "@pages/team/[slug]/[type]";
import { withAppDir } from "app/AppDirSSRHOC";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "",
    () => ""
  );

const getData = withAppDir(_getServerSideProps) as any;

export default WithLayout({
  Page: LegacyPage,
  getData,
  getLayout: null,
  isBookingPage: true,
})<"P">;
