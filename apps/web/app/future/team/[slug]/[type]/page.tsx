import LegacyPage, { getServerSideProps as _getServerSideProps } from "@pages/team/[slug]/[type]";
import { withAppDir } from "app/AppDirSSRHOC";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "",
    () => ""
  );
const getData = withAppDir(_getServerSideProps);

export default WithLayout({
  Page: LegacyPage,
  // @ts-expect-error getData arg
  getData,
  getLayout: null,
  isBookingPage: true,
})<"P">;
