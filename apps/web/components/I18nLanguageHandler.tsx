import { lookup } from "bcp-47-match";
import { useSession } from "next-auth/react";

import { CALCOM_VERSION } from "@calcom/lib/constants";
import { trpc } from "@calcom/trpc/react";

export function useViewerI18n(locale: string) {
  return trpc.viewer.public.i18n.useQuery(
    { locale, CalComVersion: CALCOM_VERSION },
    {
      /**
       * i18n should never be clubbed with other queries, so that it's caching can be managed independently.
       **/
      trpc: {
        ssr: false,
        context: { skipBatch: true },
      },
    }
  );
}

function useClientLocale(locales: string[]) {
  const session = useSession();
  // If the user is logged in, use their locale
  if (session.data?.user.locale) return session.data.user.locale;
  // If the user is not logged in, use the browser locale
  if (typeof window !== "undefined") {
    // This is the only way I found to ensure the prefetched locale is used on first render
    // FIXME: Find a better way to pick the best matching locale from the browser
    return lookup(locales, window.navigator.language) || window.navigator.language;
  }
  // If the browser is not available, use English
  return "en";
}

export function useClientViewerI18n(locales: string[]) {
  // const clientLocale = useClientLocale(locales);
  return useViewerI18n(locales[0]);
}
