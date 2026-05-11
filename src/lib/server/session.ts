import { env } from '$env/dynamic/private';
import { jwtVerify, SignJWT } from 'jose';

const COOKIE_NAME = 'hcbday-session';

function secret() {
  if (!env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET.');
  }

  return new TextEncoder().encode(env.JWT_SECRET);
}

export type SessionPayload = {
  id: string;
  name: string;
  pfp: string;
};

export async function createSessionToken(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret());
}

export async function readSessionToken(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());

    return {
      id: String(payload.id),
      name: String(payload.name),
      pfp: String(payload.pfp)
    } satisfies SessionPayload;
  } catch {
    return null;
  }
}

export const sessionCookieName = COOKIE_NAME;
