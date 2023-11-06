import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { z } from "zod";

import Workflow from "@calcom/features/ee/workflows/pages/workflow";

import PageWrapper from "@components/PageWrapperAppDir";

type Params = { workflow: string };

type WorkflowPageProps = {
  params: Params;
};

const querySchema = z.object({
  workflow: z.string(),
});

export async function getProps({ params }: { params: Params }) {
  const safeParams = querySchema.safeParse(params);

  console.log("Built workflow page:", safeParams);
  if (!safeParams.success) {
    return notFound();
  }
  return { workflow: safeParams.data.workflow };
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const props = await getProps({ params });
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  return (
    <PageWrapper getLayout={null} requiresLicense={false} nonce={nonce} themeBasis={null} {...props}>
      <Workflow />
    </PageWrapper>
  );
}

export const dynamicParams = true;
