import LegacyPage, { getServerSideProps } from "@pages/apps/categories/index";
import { cookies, headers } from "next/headers";

type Params = {
  [key: string]: string | string[] | undefined;
};

async function getPageProps({ params }: { params: Params }) {
  // @ts-expect-error context
  const result = await getServerSideProps({ params, req: { headers: headers(), cookies: cookies() } });
  return result.props;
}

export default async function Page({ params }: { params: Params }) {
  const props = await getPageProps({ params });

  return <LegacyPage {...props} />;
}
