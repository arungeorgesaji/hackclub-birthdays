import type { Handle } from '@sveltejs/kit';
import { readSessionToken, sessionCookieName } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.session = await readSessionToken(event.cookies.get(sessionCookieName));
  return await resolve(event);
};
