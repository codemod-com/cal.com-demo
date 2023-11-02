"use client";

import { useRouter as useCompatRouter } from "next/compat/router";
import { useParams } from "next/navigation";

interface Params {
  [key: string]: string | string[];
}

/**
 * This hook is a workaround until pages are migrated to app directory.
 */
export function useParamsWithFallback(): Params {
  const params = useParams(); // always `null` in pages router
  const router = useCompatRouter(); // always `null` in app router
  return params ?? router?.query ?? {};
}
