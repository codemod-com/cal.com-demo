import { appRouter } from "@calcom/trpc/server/routers/_app";

export const serverClient = appRouter.createCaller({});

export const getServerCaller = (ctx: any) => appRouter.createCaller(ctx);
