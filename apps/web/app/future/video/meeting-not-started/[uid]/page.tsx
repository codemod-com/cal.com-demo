import Page from "@pages/video/meeting-not-started/[uid]";
import { withAppDir } from "app/AppDirSSRHOC";
import type { PageProps } from "app/_types";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";

import prisma, { bookingMinimalSelect } from "@calcom/prisma";

import { getServerSideProps } from "@lib/video/meeting-not-started/[uid]/getServerSideProps";

export const generateMetadata = async ({ params }: PageProps) => {
  const booking = await prisma.booking.findUnique({
    where: {
      uid: typeof params?.uid === "string" ? params.uid : "",
    },
    select: bookingMinimalSelect,
  });

  return await _generateMetadata(
    (t) => t("this_meeting_has_not_started_yet"),
    () => booking?.title ?? ""
  );
};

// @TODO
// @ts-expect-error getData
export default WithLayout({ getData: withAppDir(getServerSideProps), Page, getLayout: null })<"P">;
