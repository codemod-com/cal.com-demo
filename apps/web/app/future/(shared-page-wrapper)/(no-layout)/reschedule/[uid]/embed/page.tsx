import type { Params } from "app/_types";

import { getData } from "../page";

type PageProps = Readonly<{
  params: Params;
}>;

export default async function Page({ params }: PageProps) {
  await getData(params, true);

  return null;
}
