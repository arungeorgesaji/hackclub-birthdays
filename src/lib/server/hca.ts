import { env } from '$env/dynamic/private';

export function getHcaAuthorizeUrl() {
  if (!env.HCA_CLIENT_ID || !env.HCA_REDIRECT_HOST) {
    throw new Error('Missing HCA_CLIENT_ID or HCA_REDIRECT_HOST.');
  }

  const url = new URL('https://auth.hackclub.com/oauth/authorize');
  url.searchParams.set('client_id', env.HCA_CLIENT_ID);
  url.searchParams.set('redirect_uri', `${env.HCA_REDIRECT_HOST}/auth/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'slack_id');
  return url.toString();
}

export async function exchangeCodeForAccessToken(code: string) {
  if (!env.HCA_CLIENT_ID || !env.HCA_CLIENT_SECRET || !env.HCA_REDIRECT_HOST) {
    throw new Error('Missing HCA OAuth configuration.');
  }

  const response = await fetch('https://auth.hackclub.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.HCA_CLIENT_ID,
      client_secret: env.HCA_CLIENT_SECRET,
      redirect_uri: `${env.HCA_REDIRECT_HOST}/auth/callback`,
      grant_type: 'authorization_code',
      code
    })
  });

  if (!response.ok) {
    throw new Error('Failed to exchange HCA code.');
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error('Missing HCA access token.');
  }

  return data.access_token;
}

export async function fetchHcaSlackId(accessToken: string) {
  const response = await fetch('https://auth.hackclub.com/api/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch HCA identity.');
  }

  const data = (await response.json()) as {
    identity?: {
      slack_id?: string;
    };
  };

  if (!data.identity?.slack_id) {
    throw new Error('Missing slack_id from HCA identity.');
  }

  return data.identity.slack_id;
}
