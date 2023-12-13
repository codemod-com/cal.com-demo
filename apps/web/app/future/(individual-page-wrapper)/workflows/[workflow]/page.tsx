import LegacyPage from "@pages/workflows/[workflow]";
import type { Params } from "app/_types";
import { _generateMetadata } from "app/_utils";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { z } from "zod";

import { APP_NAME } from "@calcom/lib/constants";

import PageWrapper from "@components/PageWrapperAppDir";

type PageProps = {
  params: Params;
};

const querySchema = z.object({
  workflow: z.string(),
});

export const generateMetadata = async ({ params }: { params: Params }) => {
  // const req = {
  //   headers: headers(),
  //   cookies: cookies(),
  // };

  // const ctx = await createContext({ req });
  // const workflow = await getServerCaller(ctx).viewer.workflows.get({ id: Number(params.workflow) });

  return await _generateMetadata(
    () => `untitled | ${APP_NAME}`,
    () => ""
  );
};

async function getProps({ params }: { params: Params }) {
  const safeParams = querySchema.safeParse(params);

  console.log("Built workflow page:", safeParams);
  if (!safeParams.success) {
    return notFound();
  }
  return { workflow: safeParams.data.workflow };
}

export const generateStaticParams = () => [];

export default async function WorkflowPage({ params }: PageProps) {
  const props = await getProps({ params });
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  return (
    <PageWrapper getLayout={null} requiresLicense={false} nonce={nonce} themeBasis={null} {...props}>
      {/* @ts-expect-error page does not require any props */}
      <LegacyPage />
    </PageWrapper>
  );
}

export const dynamic = "force-static";
// generate segments on demand
export const dynamicParams = "true";
export const revalidate = 10;
