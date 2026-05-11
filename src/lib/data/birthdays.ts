export type AccentTone = 'sunset' | 'mint' | 'aurora' | 'ocean' | 'gold';

export type BirthdayPerson = {
  id: string;
  name: string;
  date: string;
  city: string;
  role: string;
  accent: AccentTone;
  note: string;
  slackChannelId?: string;
  source?: 'sample' | 'user';
};

export const sampleBirthdays: BirthdayPerson[] = [
  { id: 'ari', name: 'Ari', date: '2026-01-08', city: 'Portland', role: 'Robotics lead', accent: 'sunset', note: 'Builds strange satellites and even stranger playlists.', source: 'sample' },
  { id: 'maya', name: 'Maya', date: '2026-01-15', city: 'Singapore', role: 'Design sprinter', accent: 'mint', note: 'Makes hackathon demos feel improbably polished.', source: 'sample' },
  { id: 'noah', name: 'Noah', date: '2026-02-03', city: 'Nairobi', role: 'Game dev', accent: 'aurora', note: 'Ships cozy browser games during overnight jams.', source: 'sample' },
  { id: 'priya', name: 'Priya', date: '2026-02-22', city: 'Bengaluru', role: 'Community host', accent: 'ocean', note: 'Knows how to turn any project update into a party.', source: 'sample' },
  { id: 'jonah', name: 'Jonah', date: '2026-03-09', city: 'Austin', role: 'Tooling wizard', accent: 'sunset', note: 'Automates away the boring parts before lunch.', source: 'sample' },
  { id: 'lena', name: 'Lena', date: '2026-03-28', city: 'Berlin', role: 'Frontend artist', accent: 'ocean', note: 'Treats gradients like serious engineering work.', source: 'sample' },
  { id: 'tariq', name: 'Tariq', date: '2026-04-07', city: 'Cairo', role: 'Infrastructure tinkerer', accent: 'mint', note: 'Finds delight in tiny deployment wins.', source: 'sample' },
  { id: 'sofi', name: 'Sofi', date: '2026-04-19', city: 'Buenos Aires', role: 'Hack night DJ', accent: 'sunset', note: 'Curates beats for late-night bug hunts.', source: 'sample' },
  { id: 'arun', name: 'Arun', date: '2026-05-11', city: 'Delhi', role: 'Builder in residence', accent: 'gold', note: 'Keeps side projects alive long enough to become real.', source: 'sample' },
  { id: 'kiko', name: 'Kiko', date: '2026-05-18', city: 'Tokyo', role: 'Hardware prototyper', accent: 'aurora', note: 'Turns napkin sketches into blinking artifacts.', source: 'sample' },
  { id: 'nia', name: 'Nia', date: '2026-06-02', city: 'Lagos', role: 'Storyteller', accent: 'ocean', note: 'Writes launch copy that makes demos land harder.', source: 'sample' },
  { id: 'ezra', name: 'Ezra', date: '2026-06-30', city: 'Toronto', role: 'Data explorer', accent: 'mint', note: 'Finds the chart no one else knew they needed.', source: 'sample' },
  { id: 'cam', name: 'Cam', date: '2026-07-04', city: 'Brooklyn', role: 'Campfire organizer', accent: 'gold', note: 'Runs meetups with suspiciously high production value.', source: 'sample' },
  { id: 'jules', name: 'Jules', date: '2026-07-27', city: 'Paris', role: 'Motion designer', accent: 'sunset', note: 'Believes every transition should earn its keep.', source: 'sample' },
  { id: 'rhea', name: 'Rhea', date: '2026-08-10', city: 'Mumbai', role: 'AI prototyper', accent: 'aurora', note: 'Likes demos that feel a little bit impossible.', source: 'sample' },
  { id: 'leo', name: 'Leo', date: '2026-08-23', city: 'Madrid', role: 'Systems thinker', accent: 'ocean', note: 'Draws architecture diagrams that people actually read.', source: 'sample' },
  { id: 'emi', name: 'Emi', date: '2026-09-06', city: 'Seoul', role: 'Workshop runner', accent: 'mint', note: 'Turns intimidating tools into approachable rituals.', source: 'sample' },
  { id: 'finn', name: 'Finn', date: '2026-09-17', city: 'Dublin', role: 'API mechanic', accent: 'gold', note: 'Makes backend work feel unusually elegant.', source: 'sample' },
  { id: 'zuri', name: 'Zuri', date: '2026-10-14', city: 'Cape Town', role: 'Hackathon captain', accent: 'sunset', note: 'Creates energy before people know they need it.', source: 'sample' },
  { id: 'milo', name: 'Milo', date: '2026-10-29', city: 'Melbourne', role: 'Open source regular', accent: 'aurora', note: 'Has a pull request ready before the issue is fully written.', source: 'sample' },
  { id: 'anya', name: 'Anya', date: '2026-11-08', city: 'Warsaw', role: 'Prototype sculptor', accent: 'mint', note: 'Finds the hidden shape of an idea fast.', source: 'sample' },
  { id: 'dev', name: 'Dev', date: '2026-11-20', city: 'London', role: 'Ship-it engine', accent: 'ocean', note: 'Keeps momentum up when projects hit the awkward middle.', source: 'sample' },
  { id: 'tess', name: 'Tess', date: '2026-12-12', city: 'Vancouver', role: 'Design systems nerd', accent: 'gold', note: 'Makes consistency feel luxurious rather than rigid.', source: 'sample' },
  { id: 'omar', name: 'Omar', date: '2026-12-27', city: 'Amman', role: 'Midnight debugger', accent: 'sunset', note: 'Finds the bug everyone else swore was impossible.', source: 'sample' }
];
