// originally from in the "experimental playground for tRPC + next.js 13" repo owned by trpc team
// file link: https://github.com/trpc/next-13/blob/main/%40trpc/next-layout/createTRPCNextLayout.ts
// repo link: https://github.com/trpc/next-13
// code is / will continue to be adapted for our usage
import { dehydrate, QueryClient } from "@tanstack/query-core";
import type { DehydratedState } from "@tanstack/react-query";

import {
  callProcedure,
  type AnyProcedure,
  type AnyQueryProcedure,
  type AnyRouter,
  type DataTransformer,
  type inferProcedureInput,
  type inferProcedureOutput,
  type inferRouterContext,
  type MaybePromise,
  type ProcedureRouterRecord,
} from "@calcom/trpc/server";

import { createRecursiveProxy, createFlatProxy } from "@trpc/server/shared";

interface CreateTRPCNextLayoutOptions<TRouter extends AnyRouter> {
  router: TRouter;
  createContext: () => MaybePromise<inferRouterContext<TRouter>>;
  transformer?: DataTransformer;
}

/**
 * @internal
 */
export type DecorateProcedure<TProcedure extends AnyProcedure> = TProcedure extends AnyQueryProcedure
  ? {
      fetch(input: inferProcedureInput<TProcedure>): Promise<inferProcedureOutput<TProcedure>>;
      fetchInfinite(input: inferProcedureInput<TProcedure>): Promise<inferProcedureOutput<TProcedure>>;
      prefetch(input: inferProcedureInput<TProcedure>): Promise<inferProcedureOutput<TProcedure>>;
      prefetchInfinite(input: inferProcedureInput<TProcedure>): Promise<inferProcedureOutput<TProcedure>>;
    }
  : never;

type OmitNever<TType> = Pick<
  TType,
  {
    [K in keyof TType]: TType[K] extends never ? never : K;
  }[keyof TType]
>;
/**
 * @internal
 */
export type DecoratedProcedureRecord<
  TProcedures extends ProcedureRouterRecord,
  TPath extends string = ""
> = OmitNever<{
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<TProcedures[TKey]["_def"]["record"], `${TPath}${TKey & string}.`>
    : TProcedures[TKey] extends AnyQueryProcedure
    ? DecorateProcedure<TProcedures[TKey]>
    : never;
}>;

type CreateTRPCNextLayout<TRouter extends AnyRouter> = DecoratedProcedureRecord<TRouter["_def"]["record"]> & {
  dehydrate(): Promise<DehydratedState>;
  queryClient: QueryClient;
};

function getQueryKey(path: string[], input: unknown) {
  return input === undefined ? [path] : [path, input];
}

const getStateContainer = <TRouter extends AnyRouter>(opts: CreateTRPCNextLayoutOptions<TRouter>) => {
  let _trpc: {
    queryClient: QueryClient;
    context: inferRouterContext<TRouter>;
  } | null = null;

  return () => {
    if (_trpc === null) {
      _trpc = {
        context: opts.createContext(),
        queryClient: new QueryClient(),
      };
    }

    return _trpc;
  };
};

export function createTRPCNextLayout<TRouter extends AnyRouter>(
  opts: CreateTRPCNextLayoutOptions<TRouter>
): CreateTRPCNextLayout<TRouter> {
  const getState = getStateContainer(opts);

  const transformer = opts.transformer ?? {
    serialize: (v) => v,
    deserialize: (v) => v,
  };

  return createFlatProxy((key) => {
    const state = getState();
    const { queryClient } = state;
    if (key === "queryClient") {
      return queryClient;
    }

    if (key === "dehydrate") {
      return () => transformer.serialize(dehydrate(queryClient));
    }

    return createRecursiveProxy(async (callOpts) => {
      const path = [key, ...callOpts.path];
      const utilName = path.pop();
      const ctx = await state.context;

      const caller = opts.router.createCaller(ctx);

      const pathStr = path.join(".");
      const input = callOpts.args[0];
      const queryKey = getQueryKey(path, input);

      if (utilName === "fetchInfinite") {
        return queryClient.fetchInfiniteQuery(queryKey, () => caller.query(pathStr, input));
      }

      if (utilName === "prefetch") {
        return queryClient.prefetchQuery({
          queryKey,
          queryFn: async () => {
            const res = await callProcedure({
              procedures: opts.router._def.procedures,
              path: pathStr,
              rawInput: input,
              ctx,
              type: "query",
            });
            return res;
          },
        });
      }

      if (utilName === "prefetchInfinite") {
        return queryClient.prefetchInfiniteQuery(queryKey, () => caller.query(pathStr, input));
      }

      return queryClient.fetchQuery(queryKey, () => caller.query(pathStr, input));
    }) as CreateTRPCNextLayout<TRouter>;
  });
}
