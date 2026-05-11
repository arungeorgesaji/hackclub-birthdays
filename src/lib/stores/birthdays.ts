import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { sampleBirthdays, type AccentTone, type BirthdayPerson } from '$lib/data/birthdays';

const STORAGE_KEY = 'hackclub-birthdays-user-entries';
const accents: AccentTone[] = ['sunset', 'mint', 'aurora', 'ocean', 'gold'];

export type BirthdayFormInput = {
  name: string;
  date: string;
  slackChannelId: string;
};

export const birthdayEntries = writable<BirthdayPerson[]>(sampleBirthdays);

export function initBirthdayEntries() {
  if (!browser) return;

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    birthdayEntries.set(sampleBirthdays);
    return;
  }

  try {
    const parsed = JSON.parse(saved) as BirthdayPerson[];
    birthdayEntries.set([...sampleBirthdays, ...parsed]);
  } catch {
    birthdayEntries.set(sampleBirthdays);
  }
}

export function addBirthdayEntry(input: BirthdayFormInput) {
  const entry: BirthdayPerson = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    date: input.date,
    city: 'Slack',
    role: 'Community member',
    accent: pickAccent(input.name),
    note: 'Added from the birthday board.',
    slackChannelId: normalizeChannelId(input.slackChannelId),
    source: 'user'
  };

  birthdayEntries.update((entries) => {
    const sampleEntries = entries.filter((person) => person.source !== 'user');
    const userEntries = [...entries.filter((person) => person.source === 'user'), entry];

    persistUserEntries(userEntries);
    return [...sampleEntries, ...userEntries];
  });
}

export function normalizeChannelId(value: string) {
  return value.trim().replace(/^https:\/\/hackclub\.enterprise\.slack\.com\/archives\//, '').replace(/\//g, '');
}

export function getSlackChannelUrl(channelId?: string) {
  return channelId
    ? `https://hackclub.enterprise.slack.com/archives/${normalizeChannelId(channelId)}`
    : null;
}

function pickAccent(seed: string): AccentTone {
  const total = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return accents[total % accents.length];
}

function persistUserEntries(entries: BirthdayPerson[]) {
  if (!browser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
