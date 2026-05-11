import { getSql } from '$lib/server/db';

export type DbUser = {
  id: string;
  name: string;
  pfp: string;
  bday_month: number | null;
  bday_day: number | null;
  channel_name: string | null;
  channel_id: string | null;
};

export async function upsertUserProfile(input: { id: string; name: string; pfp: string }) {
  const sql = getSql();
  const existing = await sql<Pick<DbUser, 'id'>[]>`SELECT id FROM users WHERE id=${input.id}`;

  if (existing.length) {
    await sql`
      UPDATE users
      SET name=${input.name}, pfp=${input.pfp}
      WHERE id=${input.id}
    `;
    return;
  }

  await sql`
    INSERT INTO users (id, name, pfp)
    VALUES (${input.id}, ${input.name}, ${input.pfp})
  `;
}

export async function getUserById(id: string) {
  const sql = getSql();
  const rows = await sql<DbUser[]>`
    SELECT id, name, pfp, bday_month, bday_day, channel_name, channel_id
    FROM users
    WHERE id=${id}
  `;

  return rows[0] ?? null;
}

export async function getUsersWithBirthdays() {
  const sql = getSql();
  return await sql<DbUser[]>`
    SELECT id, name, pfp, bday_month, bday_day, channel_name, channel_id
    FROM users
    WHERE bday_month IS NOT NULL AND bday_day IS NOT NULL
  `;
}

export async function updateBirthday(input: {
  id: string;
  month: number;
  day: number;
  channelId: string | null;
  channelName: string | null;
}) {
  const sql = getSql();
  await sql`
    UPDATE users
    SET bday_month=${input.month},
        bday_day=${input.day},
        channel_id=${input.channelId},
        channel_name=${input.channelName}
    WHERE id=${input.id}
  `;
}
