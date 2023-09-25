import { decodeRawToken, getRawToken } from "auth/lib/getToken";
import { LRUCache } from "lru-cache";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { AuthOptions, Session } from "next-auth";

import checkLicense from "@calcom/features/ee/common/server/checkLicense";
import { CAL_URL } from "@calcom/lib/constants";
import prisma from "@calcom/prisma";

/**
 * Stores the session in memory using the stringified token as the key.
 *
 */
const CACHE = new LRUCache<string, Session>({ max: 1000 });

export async function getServerSession(options: {
  req: NextApiRequest | GetServerSidePropsContext["req"];
  res?: NextApiResponse | GetServerSidePropsContext["res"];
  authOptions?: AuthOptions;
}) {
  const { req, authOptions: { secret } = {} } = options;

  const _token = getRawToken({
    req,
  });
  if (_token === null) {
    return null;
  }

  const token = await decodeRawToken(_token, null, secret);

  if (token === null || !token.email || !token.sub) {
    return null;
  }

  const cachedSession = CACHE.get(JSON.stringify(token));

  if (cachedSession) {
    return cachedSession;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: token.email.toLowerCase(),
    },
  });

  if (!user) {
    return null;
  }

  const hasValidLicense = await checkLicense(prisma);

  const session: Session = {
    hasValidLicense,
    expires: new Date(typeof token.exp === "number" ? token.exp * 1000 : Date.now()).toISOString(),
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      email_verified: user.emailVerified !== null,
      role: user.role,
      image: `${CAL_URL}/${user.username}/avatar.png`,
      impersonatedByUID: token.impersonatedByUID ?? undefined,
      belongsToActiveTeam: token.belongsToActiveTeam,
      org: token.org,
      locale: user.locale ?? undefined,
    },
  };

  CACHE.set(JSON.stringify(token), session);

  return session;
}
