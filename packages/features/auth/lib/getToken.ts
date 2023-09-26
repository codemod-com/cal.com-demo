import { SessionStore } from "next-auth/core/lib/cookie";
import type { GetTokenParams, JWT, JWTDecodeParams } from "next-auth/jwt";
import { decode } from "next-auth/jwt";

export const getRawToken = (params: GetTokenParams): string | null => {
  if (!params.raw) {
    return null;
  }

  const {
    req,
    secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL,
    cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token",
    logger = console,
  } = params;

  if (!req) {
    throw new Error("Must pass `req` to JWT getToken()");
  }

  const sessionStore = new SessionStore(
    { name: cookieName, options: { secure: secureCookie } },
    { cookies: req.cookies },
    logger
  );

  let token = sessionStore.value;

  const authorizationHeader =
    req.headers instanceof Headers ? req.headers.get("authorization") : req.headers?.authorization;

  if (!token && authorizationHeader?.split(" ")[0] === "Bearer") {
    const urlEncodedToken = authorizationHeader.split(" ")[1];
    token = decodeURIComponent(urlEncodedToken);
  }

  return token ?? null;
};

export const decodeRawToken = async (
  token: string,
  secret: JWTDecodeParams["secret"]
): Promise<JWT | null> => {
  try {
    return await decode({ token, secret });
  } catch {
    return null;
  }
};
