import { headers } from "next/headers";
import { type ReactElement } from "react";

import { getLayout } from "@calcom/features/MainLayout";

import PageWrapper from "@components/PageWrapperAppDir";

type LayoutProps = {
  children: ReactElement;
};

const getProps = async () => {
  const [_i18n, _map, _hasTeamPlan] = await Promise.all([
    fetch(
      "https://app.cal.com/api/trpc/public/i18n?input=%7B%22json%22%3A%7B%22locale%22%3A%22en%22%2C%22CalComVersion%22%3A%223.3.6%22%7D%7D",
      { cache: "no-cache" }
    ),
    fetch(
      "https://app.cal.com/api/trpc/features/map?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D",
      { cache: "no-cache" }
    ),
    fetch(
      "https://app.cal.com/api/trpc/teams/hasTeamPlan,getUpgradeable,listInvites,list?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%2C%221%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%2C%222%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%2C%223%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D",
      {
        cache: "no-cache",
      }
    ),
  ]);

  return {
    i18n: (await _i18n.json()).result.data.json.i18n,
    map: (await _map.json()).result.data.json.map,
    hasTeamPlan: (await _hasTeamPlan.json()).result.data.json.hasTeamPlan,
  };
};

async function Layout({ children }: LayoutProps) {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  const { i18n, map, hasTeamPlan } = await getProps();

  return (
    // @ts-expect-error withTrpc expects AppProps
    <PageWrapper
      getLayout={getLayout}
      requiresLicense={false}
      pageProps={{ ...children?.props, i18n, map, hasTeamPlan }}
      nonce={nonce}
      themeBasis={null}>
      {children}
    </PageWrapper>
  );
}

export default Layout;
