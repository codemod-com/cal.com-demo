import { trpc as trpcAppDir } from "app/_trpc/client";

import { trpc as trpcPageDir } from "@calcom/trpc";

export const getTprc = (isAppDir: boolean) => (isAppDir ? trpcAppDir : trpcPageDir);
