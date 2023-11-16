import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";

import { getData } from "../page";

type PageProps = Readonly<{
  params: Params;
}>;

export default async function Page({ params }: PageProps) {
  await getData(params, true);

  return null;
}
