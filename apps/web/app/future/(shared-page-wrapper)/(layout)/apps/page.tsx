import AppsPage from "@pages/apps";
import { ssrInit } from "app/_trpc/ssrInit";
import { cookies, headers } from "next/headers";

import { getAppRegistry, getAppRegistryWithCredentials } from "@calcom/app-store/_appRegistry";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import type { UserAdminTeams } from "@calcom/features/ee/teams/lib/getUserAdminTeams";
import getUserAdminTeams from "@calcom/features/ee/teams/lib/getUserAdminTeams";
import type { AppCategories } from "@calcom/prisma/enums";

const getPageProps = async () => {
  const ssr = await ssrInit();
  // @ts-expect-error headers and cookies are enough
  const session = await getServerSession({ req: { headers: headers(), cookies: cookies() } });

  let appStore, userAdminTeams: UserAdminTeams;
  if (session?.user?.id) {
    userAdminTeams = await getUserAdminTeams({ userId: session.user.id, getUserInfo: true });
    appStore = await getAppRegistryWithCredentials(session.user.id, userAdminTeams);
  } else {
    appStore = await getAppRegistry();
    userAdminTeams = [];
  }

  const categoryQuery = appStore.map(({ categories }) => ({
    categories: categories || [],
  }));

  const categories = categoryQuery.reduce((c, app) => {
    for (const category of app.categories) {
      c[category] = c[category] ? c[category] + 1 : 1;
    }
    return c;
  }, {} as Record<string, number>);

  return {
    categories: Object.entries(categories)
      .map(([name, count]): { name: AppCategories; count: number } => ({
        name: name as AppCategories,
        count,
      }))
      .sort(function (a, b) {
        return b.count - a.count;
      }),
    appStore,
    userAdminTeams,
    trpcState: await ssr.dehydrate(),
  };
};

export default async function AppPageAppDir() {
  const { categories, appStore, userAdminTeams } = await getPageProps();

  return <AppsPage categories={categories} appStore={appStore} userAdminTeams={userAdminTeams} />;
}
