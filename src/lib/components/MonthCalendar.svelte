<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import type { BirthdayPerson } from '$lib/data/birthdays';
  import { getSlackChannelUrl } from '$lib/utils/slack';
  import { buildCalendar, formatMonth, getMonthEntries } from '$lib/utils/calendar';

  export let month: Date;
  export let entries: BirthdayPerson[] = [];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  $: cells = buildCalendar(entries, month);
  $: monthEntries = getMonthEntries(entries, month);
  $: monthLabel = formatMonth(month);

  function accent(person: BirthdayPerson) {
    switch (person.accent) {
      case 'mint':
        return 'linear-gradient(135deg, rgba(124, 226, 194, 0.8), rgba(80, 163, 168, 0.4))';
      case 'ocean':
        return 'linear-gradient(135deg, rgba(124, 207, 255, 0.85), rgba(59, 94, 183, 0.45))';
      case 'gold':
        return 'linear-gradient(135deg, rgba(255, 207, 112, 0.9), rgba(255, 151, 108, 0.4))';
      case 'aurora':
        return 'linear-gradient(135deg, rgba(188, 153, 255, 0.8), rgba(113, 221, 191, 0.42))';
      default:
        return 'linear-gradient(135deg, rgba(255, 141, 122, 0.85), rgba(255, 207, 112, 0.35))';
    }
  }
</script>

<section class="calendar glass">
  <div class="calendar-header">
    <div>
      <p class="calendar-kicker">Calendar</p>
      <h2>{monthLabel}</h2>
    </div>
  </div>

  <div class="weekday-row">
    {#each days as day}
      <div>{day}</div>
    {/each}
  </div>

  <div class="grid">
    {#each cells as cell, index (cell.iso ?? `blank-${index}`)}
      <article
        class:blank={!cell.day}
        class="cell"
        in:fly={{ y: 18, duration: 350, delay: Math.min(index * 12, 180) }}
        out:fade={{ duration: 120 }}
      >
        {#if cell.day}
          <div class="day-row">
            <span class="day">{cell.day}</span>
          </div>

          <div class="content">
            {#if cell.entries.length}
              {#each cell.entries as person}
                <div class="birthday-card" transition:scale={{ start: 0.92, duration: 220 }}>
                  <img class="avatar" src={person.pfp} alt={person.name} />
                  <div class="birthday-copy">
                    <strong>{person.name}</strong>
                    {#if person.slackChannelId}
                      <a class="slack-link" href={getSlackChannelUrl(person.slackChannelId) ?? '#'} target="_blank" rel="noreferrer">
                        #{person.slackChannelName ?? 'Slack channel'}
                      </a>
                    {/if}
                  </div>
                </div>
              {/each}
            {:else}
              <p class="quiet">No birthdays</p>
            {/if}
          </div>
        {/if}
      </article>
    {/each}
  </div>
</section>

<style>
  .calendar {
    border-radius: 1.6rem;
    padding: 1.1rem;
  }

  .calendar-header {
    display: flex;
    align-items: end;
    margin-bottom: 1rem;
  }

  .calendar-kicker {
    margin: 0 0 0.35rem;
    color: var(--gold-soft);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.74rem;
  }

  h2 {
    margin: 0;
    font-family: var(--display);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 600;
  }

  .weekday-row {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.55rem;
    margin-bottom: 0.7rem;
    color: var(--muted);
    font-size: 0.88rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .weekday-row div {
    padding: 0.25rem 0.55rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .cell {
    min-height: 9.5rem;
    border-radius: 1rem;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.03);
    padding: 0.75rem;
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }

  .cell:hover {
    transform: translateY(-3px);
    border-color: rgba(243, 228, 180, 0.18);
  }

  .cell.blank {
    background: transparent;
    border-style: dashed;
    min-height: 7.5rem;
    opacity: 0.2;
  }

  .day-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.9rem;
  }

  .day {
    font-size: 1.1rem;
    color: var(--text);
    font-weight: 700;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .birthday-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.7rem;
    align-items: center;
    padding: 0.58rem;
    border-radius: 0.9rem;
    background: rgba(255, 255, 255, 0.045);
  }

  .birthday-card strong {
    display: block;
    margin-bottom: 0.18rem;
    overflow-wrap: anywhere;
  }

  .birthday-copy {
    min-width: 0;
  }

  .quiet {
    margin: 0;
    color: var(--muted);
    font-size: 0.84rem;
    line-height: 1.35;
  }

  .slack-link {
    display: -webkit-box;
    margin-top: 0.28rem;
    color: var(--cyan);
    font-size: 0.82rem;
    overflow: hidden;
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .avatar {
    width: 0.95rem;
    height: 0.95rem;
    border-radius: 999px;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.14);
    object-fit: cover;
  }

  .quiet {
    opacity: 0.7;
  }

  @media (max-width: 980px) {
    .weekday-row,
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .weekday-row {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .calendar-header {
      flex-direction: column;
      align-items: start;
    }

    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
