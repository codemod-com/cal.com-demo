import { get } from "@vercel/edge-config";
import { getBucket } from "abTest/utils";
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Bucket = (typeof BUCKETS)[number];

const BUCKETS = ["future", "legacy"] as const;

const ROUTES = [
  {
    pathname: "/event-types",
    cookie: "bucket-event-types",
    buckets: BUCKETS,
    featureFlagName: "isABTestEnabledEventTypes",
  },
] as const;

export const ABTestMiddlewareFactory =
  (next: NextMiddleware): NextMiddleware =>
  async (req: NextRequest, event: NextFetchEvent) => {
    const { pathname } = req.nextUrl;

    const route = ROUTES.find((route) => route.pathname === pathname);

    if (!route) {
      return next(req, event);
    }

    const ABTestEnabled = get<boolean>(route.featureFlagName);

    if (!ABTestEnabled) {
      return next(req, event);
    }

    const bucket = req.cookies.get(route.cookie)?.value as Bucket | undefined;

    if (!bucket || !route.buckets.includes(bucket)) {
      return next(req, event);
    }

    const bucketUrlPrefix = bucket === "future" ? "future" : "";

    const url = req.nextUrl.clone();
    url.pathname = `${bucketUrlPrefix}/${pathname}/`;
    const res = NextResponse.rewrite(url);

    if (bucket === undefined) {
      res.cookies.set(route.cookie, getBucket());
    }

    return res;
  };
