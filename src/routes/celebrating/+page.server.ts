import { redirect } from '@sveltejs/kit';
import { getUsersWithBirthdays } from '$lib/server/users';
import type { BirthdayPerson } from '$lib/data/birthdays';

const accents = ['sunset', 'mint', 'aurora', 'ocean', 'gold'] as const;

export async function load({ locals }) {
  if (!locals.session) {
    throw redirect(303, '/');
  }

  const users = await getUsersWithBirthdays();

  return {
    session: locals.session,
    birthdays: users.map(toBirthdayPerson)
  };
}

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
