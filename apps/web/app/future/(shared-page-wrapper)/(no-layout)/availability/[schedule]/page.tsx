import Page from "@pages/availability/[schedule]";
import { type Params } from "app/_types";
import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";

export const generateMetadata = async ({ params }: { params: Params }) => {
  const scheduleId = params.schedule ? Number(params.schedule) : -1;

  // @ts-expect-error Type '{ headers: ReadonlyHeaders; cookies: ReadonlyRequestCookies; }' is not assignable to type 'NextApiRequest'
  const data = await getServerCaller({ req, prisma }).viewer.availability.schedule.get({ scheduleId });
  const { schedule } = data;
  const req = {
    headers: headers(),
    cookies: cookies(),
  };

  await _generateMetadata(
    (t) => (schedule?.name ? `${schedule.name} | ${t("availability")}` : t("availability")),
    (t) => (schedule?.name ? `${schedule.name} | ${t("availability")}` : t("availability"))
  );
};

export default Page;
