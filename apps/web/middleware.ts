import { get } from "@vercel/edge-config";
import { collectEvents } from "next-collect/server";
import type { NextMiddleware } from "next/server";
import { NextResponse } from "next/server";

import { extendEventData, nextCollectBasicSettings } from "@calcom/lib/telemetry";

const middleware: NextMiddleware = async (req) => {
  const url = req.nextUrl;

  if (!url.pathname.startsWith("/api")) {
    //
    // NOTE: When tRPC hits an error a 500 is returned, when this is received
    //       by the application the user is automatically redirected to /auth/login.
    //
    //     - For this reason our matchers are sufficient for an app-wide maintenance page.
    //
    try {
      // Check whether the maintenance page should be shown
      const isInMaintenanceMode = await get<boolean>("isInMaintenanceMode");
      // If is in maintenance mode, point the url pathname to the maintenance page
      if (isInMaintenanceMode) {
        req.nextUrl.pathname = `/maintenance`;
        return NextResponse.rewrite(req.nextUrl);
      }
    } catch (error) {
      // show the default page if EDGE_CONFIG env var is missing,
      // but log the error to the console
      // console.error(error);
    }
  }

  // Don't 404 old routing_forms links
  if (url.pathname.startsWith("/apps/routing_forms")) {
    url.pathname = url.pathname.replace(/^\/apps\/routing_forms($|\/)/, "/apps/routing-forms/");
    return NextResponse.rewrite(url);
  }

  const headers = new Headers(req.headers);

  // since we cannot use usePathname within generateMetadata
  // we set the x-cal-pathname header so we can read it using headers()
  headers.set("x-cal-pathname", url.pathname);

  if (url.pathname.startsWith("/api/trpc/")) {
    headers.set("x-cal-timezone", req.headers.get("x-vercel-ip-timezone") ?? "");
  }

  if (url.pathname.startsWith("/auth/login") || url.pathname.startsWith("/login")) {
    // Use this header to actually enforce CSP, otherwise it is running in Report Only mode on all pages.
    headers.set("x-csp-enforce", "true");
  }

  return NextResponse.next({
    request: {
      headers,
    },
  });
};

export const config = {
  // Next.js Doesn't support spread operator in config matcher, so, we must list all paths explicitly here.
  // https://github.com/vercel/next.js/discussions/42458
  matcher: [
    "/:path*/embed",
    "/api/trpc/:path*",
    "/login",
    "/auth/login",
    /**
     * Paths required by routingForms.handle
     */
    "/apps/routing_forms/:path*",
  ],
};

export default collectEvents({
  middleware,
  ...nextCollectBasicSettings,
  cookieName: "__clnds",
  extend: extendEventData,
});
