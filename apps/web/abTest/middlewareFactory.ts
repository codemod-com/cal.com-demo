import { get } from "@vercel/edge-config";
import { getBucket } from "abTest/utils";
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";

const BUCKETS = ["future", "legacy"] as const;

const ROUTES = [
  {
    pathname: "/event-types",
    cookie: "bucket-event-types",
    buckets: BUCKETS,
    featureFlagName: "isABTestEnabledEventTypes",
  },
] as const;

const bucketSchema = z.union([z.literal("legacy"), z.literal("future")]);

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

    const parsedBucket = bucketSchema.safeParse(req.cookies.get(route.cookie)?.value);

    const bucketCookieExists = parsedBucket.success;

    if (!bucketCookieExists) {
      const res = NextResponse.next();
      res.cookies.set(route.cookie, getBucket(), { expires: 1000 * 60 * 30 }); // 30 min in ms
      return res;
    }

    const bucket = parsedBucket.data;

    if (!route.buckets.includes(bucket)) {
      return next(req, event);
    }

    const bucketUrlPrefix = bucketCookieExists && bucket === "future" ? "future" : "";

    const url = req.nextUrl.clone();
    url.pathname = `${bucketUrlPrefix}${pathname}/`;
    const res = NextResponse.rewrite(url);

    return res;
  };
