import { redirect } from '@sveltejs/kit';
import { exchangeCodeForAccessToken, fetchHcaSlackId } from '$lib/server/hca';
import { createSessionToken, sessionCookieName } from '$lib/server/session';
import { fetchSlackUser } from '$lib/server/slack';
import { upsertUserProfile } from '$lib/server/users';

export async function GET({ url, cookies }) {
  const code = url.searchParams.get('code');

  if (!code) {
    throw redirect(303, '/');
  }

  const accessToken = await exchangeCodeForAccessToken(code);
  const slackId = await fetchHcaSlackId(accessToken);
  const profile = await fetchSlackUser(slackId);

  await upsertUserProfile({
    id: slackId,
    name: profile.name,
    pfp: profile.pfp
  });

  const sessionToken = await createSessionToken({
    id: slackId,
    name: profile.name,
    pfp: profile.pfp
  });

  cookies.set(sessionCookieName, sessionToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 60 * 24 * 30
  });

  throw redirect(303, '/');
}
