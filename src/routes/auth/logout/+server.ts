import { redirect } from '@sveltejs/kit';
import { sessionCookieName } from '$lib/server/session';

export function GET({ cookies }) {
  cookies.delete(sessionCookieName, { path: '/' });
  throw redirect(303, '/signed-out');
}
