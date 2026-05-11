export type AccentTone = 'sunset' | 'mint' | 'aurora' | 'ocean' | 'gold';

export type BirthdayPerson = {
  id: string;
  name: string;
  pfp: string;
  date: string;
  accent: AccentTone;
  slackChannelId?: string | null;
  slackChannelName?: string | null;
};
