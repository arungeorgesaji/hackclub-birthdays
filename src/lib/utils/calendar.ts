import type { BirthdayPerson } from '$lib/data/birthdays';

export type CalendarCell = {
  day: number | null;
  iso: string | null;
  entries: BirthdayPerson[];
};

export function formatMonth(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function formatBirthdayLabel(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(iso));
}

export function getMonthEntries(entries: BirthdayPerson[], date: Date) {
  const month = date.getMonth();

  return entries
    .filter((person) => new Date(person.date).getMonth() === month)
    .sort((left, right) => left.date.localeCompare(right.date));
}

export function buildCalendar(entries: BirthdayPerson[], date: Date): CalendarCell[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlankDays = firstDay.getDay();

  const cells: CalendarCell[] = Array.from({ length: leadingBlankDays }, () => ({
    day: null,
    iso: null,
    entries: []
  }));

  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
    const birthdaysForDay = entries.filter((person) => person.date.endsWith(iso.slice(5)));

    cells.push({
      day,
      iso,
      entries: birthdaysForDay
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, iso: null, entries: [] });
  }

  return cells;
}

export function getUpcomingBirthdays(entries: BirthdayPerson[], from = new Date(), count = 6) {
  const anchor = new Date(from.getFullYear(), from.getMonth(), from.getDate());

  return entries
    .map((person) => {
      const original = new Date(person.date);
      const nextBirthday = new Date(anchor.getFullYear(), original.getMonth(), original.getDate());

      if (nextBirthday < anchor) {
        nextBirthday.setFullYear(anchor.getFullYear() + 1);
      }

      const daysAway = Math.round((nextBirthday.getTime() - anchor.getTime()) / 86400000);

      return {
        ...person,
        daysAway,
        nextBirthday
      };
    })
    .sort((left, right) => left.daysAway - right.daysAway)
    .slice(0, count);
}
