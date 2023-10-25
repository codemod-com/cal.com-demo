import { trpc as trpcAppDir } from "@calcom/web/app/_trpc/client";

import { trpc } from "../trpc";

export function useEmailVerifyCheck() {
  const emailCheck = (trpc ?? trpcAppDir).viewer.shouldVerifyEmail.useQuery(undefined, {
    retry(failureCount) {
      return failureCount > 3;
    },
  });

  return emailCheck;
}

export default useEmailVerifyCheck;
