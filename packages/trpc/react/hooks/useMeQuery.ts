import { trpc as trpcAppDir } from "@calcom/web/app/_trpc/client";

import { trpc } from "../trpc";

export function useMeQuery() {
  const meQuery = (trpc ?? trpcAppDir).viewer.me.useQuery(undefined, {
    retry(failureCount) {
      return failureCount > 3;
    },
  });

  return meQuery;
}

export default useMeQuery;
