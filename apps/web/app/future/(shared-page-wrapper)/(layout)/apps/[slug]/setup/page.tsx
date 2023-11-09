import SetupPage from "@pages/apps/[slug]/setup";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { getServerSideProps } from "@calcom/app-store/_pages/setup/_getServerSideProps";

const getPageProps = async ({ params }: { params: Record<string, string | string[]> }) => {
  // @ts-expect-error @TODO check
  const result = await getServerSideProps({ params, req: { headers: headers(), cookies: cookies() } });

  if (!result || "notFound" in result) {
    notFound();
  }

  if ("redirect" in result) {
    redirect(result.redirect.destination);
  }

  return result.props;
};

export default async function Page({ params }: { params: Record<string, string | string[]> }) {
  const pageProps = await getPageProps({ params });
  return <SetupPage {...pageProps} />;
}
