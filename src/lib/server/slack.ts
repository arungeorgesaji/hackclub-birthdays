import { env } from '$env/dynamic/private';

function slackToken() {
  if (!env.SLACK_XOXB) {
    throw new Error('Missing SLACK_XOXB.');
  }

  return env.SLACK_XOXB;
}

export async function fetchSlackUser(slackId: string) {
  const response = await fetch(`https://slack.com/api/users.info?user=${encodeURIComponent(slackId)}`, {
    headers: {
      Authorization: `Bearer ${slackToken()}`
    }
  });

  const data = (await response.json()) as {
    ok: boolean;
    error?: string;
    user?: {
      profile?: {
        display_name?: string;
        real_name?: string;
        image_512?: string;
        image_192?: string;
        image_72?: string;
      };
    };
  };

  const name = data.user?.profile?.display_name || data.user?.profile?.real_name;
  const pfp =
    data.user?.profile?.image_512 ||
    data.user?.profile?.image_192 ||
    data.user?.profile?.image_72;

  if (!data.ok || !name || !pfp) {
    const details = {
      ok: data.ok,
      error: data.error ?? null,
      hasName: Boolean(name),
      hasPfp: Boolean(pfp),
      slackId
    };

    console.error('Slack users.info failed', details);
    throw new Error(`Slack users.info failed: ${JSON.stringify(details)}`);
  }

  return { name, pfp };
}

export async function fetchPublicChannel(channelId: string) {
  const response = await fetch(
    `https://slack.com/api/conversations.info?channel=${encodeURIComponent(channelId)}`,
    {
      headers: {
        Authorization: `Bearer ${slackToken()}`
      }
    }
  );

  const data = (await response.json()) as {
    ok: boolean;
    error?: string;
    channel?: {
      name?: string;
      is_channel?: boolean;
      is_private?: boolean;
    };
  };

  if (!data.ok || !data.channel?.name || !data.channel.is_channel || data.channel.is_private) {
    console.error('Slack conversations.info failed', {
      ok: data.ok,
      error: data.error ?? null,
      channelId,
      hasName: Boolean(data.channel?.name),
      isChannel: Boolean(data.channel?.is_channel),
      isPrivate: Boolean(data.channel?.is_private)
    });
    return null;
  }

  return {
    id: channelId,
    name: data.channel.name
  };
}
