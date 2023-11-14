import LegacyPage from "@pages/apps/categories/index";
import { ssrInit } from "app/_trpc/ssrInit";
import { cookies, headers } from "next/headers";

import { getAppRegistry, getAppRegistryWithCredentials } from "@calcom/app-store/_appRegistry";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

async function getPageProps() {
  const ssr = await ssrInit();
  const req = { headers: headers(), cookies: cookies() };
  const session = await getServerSession({ req });

  let appStore;
  if (session?.user?.id) {
    appStore = await getAppRegistryWithCredentials(session.user.id);
  } else {
    appStore = await getAppRegistry();
  }

  const categories = appStore.reduce((c, app) => {
    for (const category of app.categories) {
      c[category] = c[category] ? c[category] + 1 : 1;
    }
    return c;
  }, {} as Record<string, number>);

  return {
    categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
    trpcState: await ssr.dehydrate(),
  };
}

export default async function Page() {
  const props = await getPageProps();

  return <LegacyPage {...props} />;
}