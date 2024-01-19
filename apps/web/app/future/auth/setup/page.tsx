import Setup from "@pages/auth/setup";
import { ssrInit } from "app/_trpc/ssrInit";
import { WithLayout } from "app/layoutHOC";
import type { GetServerSidePropsContext } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { getDeploymentKey } from "@calcom/features/ee/deployment/lib/getDeploymentKey";
import prisma from "@calcom/prisma";
import { UserPermissionRole } from "@calcom/prisma/enums";

async function getData(_context: Omit<GetServerSidePropsContext, "res" | "resolvedUrl">) {
  const req = { headers: headers(), cookies: cookies() };

  const ssr = await ssrInit();
  const userCount = await prisma.user.count();

  // @ts-expect-error Type '{ headers: ReadonlyHeaders; cookies: ReadonlyRequestCookies; }' is not assignable to type 'NextApiRequest | IncomingMessage
  const session = await getServerSession({ req });

  if (session?.user.role && session?.user.role !== UserPermissionRole.ADMIN) {
    return redirect("/404");
  }

  const deploymentKey = await prisma.deployment.findUnique({
    where: { id: 1 },
    select: { licenseKey: true },
  });

  // Check existant CALCOM_LICENSE_KEY env var and acccount for it
  if (!!process.env.CALCOM_LICENSE_KEY && !deploymentKey?.licenseKey) {
    await prisma.deployment.upsert({
      where: { id: 1 },
      update: {
        licenseKey: process.env.CALCOM_LICENSE_KEY,
        agreedLicenseAt: new Date(),
      },
      create: {
        licenseKey: process.env.CALCOM_LICENSE_KEY,
        agreedLicenseAt: new Date(),
      },
    });
  }

  const isFreeLicense = (await getDeploymentKey(prisma)) === "";

  return {
    trpcState: ssr.dehydrate(),
    isFreeLicense,
    userCount,
  };
}

// @ts-expect-error getData arg
export default WithLayout({ getLayout: null, Page: Setup, getData })<"P">;
