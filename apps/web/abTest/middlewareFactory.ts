import { getBucket } from "abTest/utils";
import type { NextMiddleware, NextRequest } from "next/server";
import { NextResponse, URLPattern } from "next/server";
import z from "zod";

const ROUTES: [URLPattern, boolean][] = [
  ["/apps", Boolean(process.env.APP_ROUTER_APPS_ENABLED)] as const,
  ["/apps/:slug", Boolean(process.env.APP_ROUTER_APPS_SLUG_ENABLED)] as const,
  ["/apps/:slug/:pages+", Boolean(process.env.APP_ROUTER_APPS_SLUG_PAGES_ENABLED)] as const,
  ["/apps/:slug/setup", Boolean(process.env.APP_ROUTER_APPS_SLUG_SETUP_ENABLED)] as const,
  ["/apps/categories", Boolean(process.env.APP_ROUTER_APPS_CATEGORIES_ENABLED)] as const,
  ["/apps/categories/:category", Boolean(process.env.APP_ROUTER_APPS_CATEGORIES_CATEGORY_ENABLED)] as const,
  ["/apps/installed/:category", Boolean(process.env.APP_ROUTER_APPS_INSTALLED_CATEGORY_ENABLED)] as const,
  ["/availability", Boolean(process.env.APP_ROUTER_AVAILABILITY_ENABLED)] as const,
  ["/availability/:schedule", Boolean(process.env.APP_ROUTER_AVAILABILITY_SCHEDULE_ENABLED)] as const,
  ["/availability/troubleshoot", Boolean(process.env.APP_ROUTER_AVAILABILITY_TROUBLESHOOT_ENABLED)] as const,
  ["/bookings/:status", Boolean(process.env.APP_ROUTER_BOOKINGS_STATUS_ENABLED)] as const,
  ["/event-types", Boolean(process.env.APP_ROUTER_EVENT_TYPES_ENABLED)] as const,
  ["/getting-started/:step*", Boolean(process.env.APP_ROUTER_GETTING_STARTED_STEP_ENABLED)] as const,
  ["/insights", Boolean(process.env.APP_ROUTER_INSIGHTS_ENABLED)] as const,
  ["/payment/:uid", Boolean(process.env.APP_ROUTER_PAYMENT_UID_ENABLED)] as const,
  ["/settings/billing", Boolean(process.env.APP_ROUTER_SETTINGS_BILLING_ENABLED)] as const,
  [
    "/settings/developer/webhooks",
    Boolean(process.env.APP_ROUTER_SETTINGS_DEVELOPER_WEBHOOKS_ENABLED),
  ] as const,
  [
    "/settings/my-account/appearance",
    Boolean(process.env.APP_ROUTER_SETTINGS_MY_ACCOUNT_APPEARANCE_ENABLED),
  ] as const,
  [
    "/settings/my-account/calendars",
    Boolean(process.env.APP_ROUTER_SETTINGS_MY_ACCOUNT_CALENDARS_ENABLED),
  ] as const,
  [
    "/settings/my-account/conferencing",
    Boolean(process.env.APP_ROUTER_SETTINGS_MY_ACCOUNT_CONFERENCING_ENABLED),
  ] as const,
  [
    "/settings/my-account/general",
    Boolean(process.env.APP_ROUTER_SETTINGS_MY_ACCOUNT_GENERAL_ENABLED),
  ] as const,
  [
    "/settings/my-account/profile",
    Boolean(process.env.APP_ROUTER_SETTINGS_MY_ACCOUNT_PROFILE_ENABLED),
  ] as const,
  [
    "/settings/security/impersonation",
    Boolean(process.env.APP_ROUTER_SETTINGS_SECURITY_IMPERSONATION_ENABLED),
  ] as const,
  [
    "/settings/security/password",
    Boolean(process.env.APP_ROUTER_SETTINGS_SECURITY_PASSWORD_ENABLED),
  ] as const,
  [
    "/settings/security/two-factor-auth",
    Boolean(process.env.APP_ROUTER_SETTINGS_SECURITY_TWO_FACTOR_AUTH_ENABLED),
  ] as const,
  ["/teams", Boolean(process.env.APP_ROUTER_TEAMS_ENABLED)] as const,
  ["/video/:uid", Boolean(process.env.APP_ROUTER_VIDEO_UID_ENABLED)] as const,
  ["/video/meeting-ended/:uid", Boolean(process.env.APP_ROUTER_VIDEO_MEETING_ENDED_UID_ENABLED)] as const,
  [
    "/video/meeting-not-started/:uid",
    Boolean(process.env.APP_ROUTER_VIDEO_MEETING_NOT_STARTED_UID_ENABLED),
  ] as const,
  ["/video/no-meeting-found", Boolean(process.env.APP_ROUTER_VIDEO_NO_MEETING_FOUND_ENABLED)] as const,
  ["/workflows", Boolean(process.env.APP_ROUTER_WORKFLOWS_ENABLED)] as const,
  ["/workflows/:workflow", Boolean(process.env.APP_ROUTER_WORKFLOWS_WORKFLOW_ENABLED)] as const,
].map(([pathname, enabled]) => [
  new URLPattern({
    pathname,
  }),
  enabled,
]);

const FUTURE_ROUTES_OVERRIDE_COOKIE_NAME = "x-calcom-future-routes-override";
const FUTURE_ROUTES_ENABLED_COOKIE_NAME = "x-calcom-future-routes-enabled";

const bucketSchema = z.union([z.literal("legacy"), z.literal("future")]).default("legacy");

export const abTestMiddlewareFactory =
  (next: (req: NextRequest) => Promise<NextResponse<unknown>>): NextMiddleware =>
  async (req: NextRequest) => {
    const response = await next(req);

    const { pathname } = req.nextUrl;

    const override = req.cookies.has(FUTURE_ROUTES_OVERRIDE_COOKIE_NAME);

    const route = ROUTES.find(([regExp]) => regExp.test(pathname)) ?? null;

    const enabled = route !== null ? route[1] || override : false;

    if (pathname.includes("future") || !enabled) {
      return response;
    }

    const safeParsedBucket = override
      ? { success: true as const, data: "future" as const }
      : bucketSchema.safeParse(req.cookies.get(FUTURE_ROUTES_ENABLED_COOKIE_NAME)?.value);

    if (!safeParsedBucket.success) {
      // cookie does not exist or it has incorrect value

      const res = NextResponse.next(response);
      res.cookies.set(FUTURE_ROUTES_ENABLED_COOKIE_NAME, getBucket(), { expires: 1000 * 60 * 30 }); // 30 min in ms
      return res;
    }

    const bucketUrlPrefix = safeParsedBucket.data === "future" ? "future" : "";

    const url = req.nextUrl.clone();
    url.pathname = `${bucketUrlPrefix}${pathname}/`;

    return NextResponse.rewrite(url, response);
  };
