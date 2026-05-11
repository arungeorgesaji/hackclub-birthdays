<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import type { BirthdayPerson } from '$lib/data/birthdays';
  import { getSlackChannelUrl } from '$lib/utils/slack';
  import { buildCalendar, formatMonth } from '$lib/utils/calendar';

  export let month: Date;
  export let entries: BirthdayPerson[] = [];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let selectedCell:
    | {
        day: number;
        iso: string;
        entries: BirthdayPerson[];
      }
    | null = null;

  $: cells = buildCalendar(entries, month);
  $: monthLabel = formatMonth(month);
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
              <button
                class="avatar-stack"
                type="button"
                aria-label={`View birthdays for ${monthLabel} ${cell.day}`}
                onclick={() => (selectedCell = { day: cell.day!, iso: cell.iso!, entries: cell.entries })}
              >
                {#each cell.entries.slice(0, 6) as person, personIndex}
                  <img
                    class="avatar"
                    src={person.pfp}
                    alt={person.name}
                    style={`z-index:${10 - personIndex}`}
                  />
                {/each}

                {#if cell.entries.length > 6}
                  <span class="overflow-count">+{cell.entries.length - 6}</span>
                {/if}
              </button>
            {/if}
          </div>
        {/if}
      </article>
    {/each}
  </div>
</section>

{#if selectedCell}
  <button
    class="day-backdrop"
    type="button"
    aria-label="Close"
    onclick={() => (selectedCell = null)}
  ></button>
  <div class="day-modal glass" in:fade={{ duration: 180 }}>
    <div class="day-modal-head">
      <div>
        <p>Birthdays</p>
        <strong>{monthLabel} {selectedCell.day}</strong>
      </div>
      <button class="close" type="button" aria-label="Close" onclick={() => (selectedCell = null)}>
        ×
      </button>
    </div>

    <div class="day-list">
      {#each selectedCell.entries as person}
        <div class="birthday-card" transition:scale={{ start: 0.92, duration: 220 }}>
          <img class="detail-avatar" src={person.pfp} alt={person.name} />
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
    </div>
  </div>
{/if}

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
    min-height: 5rem;
  }

  .avatar-stack {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  .avatar-stack .avatar {
    margin-right: -0.35rem;
  }

  .overflow-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.55rem;
    height: 1.55rem;
    margin-left: 0.45rem;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.05);
    color: var(--muted);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .birthday-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.7rem;
    align-items: center;
    padding: 0.72rem;
    border-radius: 0.95rem;
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
    width: 1.55rem;
    height: 1.55rem;
    border-radius: 999px;
    border: 2px solid var(--panel);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.14);
    object-fit: cover;
  }

  .detail-avatar {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 999px;
    object-fit: cover;
  }

  .day-backdrop {
    position: fixed;
    inset: 0;
    border: 0;
    background: rgba(8, 10, 14, 0.62);
    z-index: 60;
  }

  .day-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    width: min(30rem, calc(100vw - 2rem));
    max-height: min(36rem, calc(100vh - 2rem));
    padding: 1rem;
    border-radius: 1.25rem;
    transform: translate(-50%, -50%);
    z-index: 70;
    overflow: auto;
  }

  .day-modal-head {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .day-modal-head p {
    margin: 0 0 0.25rem;
    color: var(--muted);
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .day-modal-head strong {
    font-size: 1.35rem;
  }

  .day-list {
    display: grid;
    gap: 0.65rem;
  }

  .close {
    width: 2.2rem;
    height: 2.2rem;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    color: var(--text);
    cursor: pointer;
    font-size: 1.35rem;
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
