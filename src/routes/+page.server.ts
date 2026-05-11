import { fail, redirect } from '@sveltejs/kit';
import type { BirthdayPerson } from '$lib/data/birthdays';
import { fetchPublicChannel } from '$lib/server/slack';
import { getUserById, getUsersWithBirthdays, updateBirthday } from '$lib/server/users';

const accents = ['sunset', 'mint', 'aurora', 'ocean', 'gold'] as const;

function requireSession(locals: App.Locals) {
  if (!locals.session) {
    throw redirect(303, '/auth/login');
  }

  return locals.session;
}

export async function load({ locals }) {
  if (!locals.session) {
    throw redirect(303, '/auth/login');
  }

  const [currentUser, birthdays] = await Promise.all([
    getUserById(locals.session.id),
    getUsersWithBirthdays()
  ]);

  return {
    session: locals.session,
    currentUser,
    birthdays: birthdays.map(toBirthdayPerson)
  };
}

export const actions = {
  saveBirthday: async ({ request, locals }) => {
    const session = requireSession(locals);
    const formData = await request.formData();

    const birthday = String(formData.get('birthday') ?? '');
    const channelIdRaw = String(formData.get('slackChannelId') ?? '').trim();

    if (!birthday) {
      return fail(400, { error: 'Birthday is required.' });
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthday);

    if (!match) {
      return fail(400, { error: 'Birthday is invalid.' });
    }

    const month = Number(match[2]);
    const day = Number(match[3]);

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return fail(400, { error: 'Birthday is invalid.' });
    }

    let channelId: string | null = null;
    let channelName: string | null = null;

    if (channelIdRaw) {
      const normalized = channelIdRaw
        .replace(/^https:\/\/hackclub\.enterprise\.slack\.com\/archives\//, '')
        .replace(/\//g, '');

      const channel = await fetchPublicChannel(normalized);

      if (!channel) {
        return fail(400, { error: 'Slack channel ID must point to a public channel.' });
      }

      channelId = channel.id;
      channelName = channel.name;
    }

    await updateBirthday({
      id: session.id,
      month: month - 1,
      day,
      channelId,
      channelName
    });

    return { success: true };
  }
};

function toBirthdayPerson(user: {
  id: string;
  name: string;
  pfp: string;
  bday_month: number | null;
  bday_day: number | null;
  channel_id: string | null;
  channel_name: string | null;
}): BirthdayPerson {
  const month = String((user.bday_month ?? 0) + 1).padStart(2, '0');
  const day = String(user.bday_day ?? 1).padStart(2, '0');

  return {
    id: user.id,
    name: user.name,
    pfp: user.pfp,
    date: `2000-${month}-${day}`,
    accent: accents[user.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % accents.length],
    slackChannelId: user.channel_id,
    slackChannelName: user.channel_name
  };
}
