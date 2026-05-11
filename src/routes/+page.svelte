<script lang="ts">
  import { fade } from 'svelte/transition';
  import { addBirthdayEntry, birthdayEntries, getSlackChannelUrl, normalizeChannelId } from '$lib/stores/birthdays';
  import MonthCalendar from '$lib/components/MonthCalendar.svelte';
  import TopNav from '$lib/components/TopNav.svelte';

  const now = new Date();
  let currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  let form = {
    name: '',
    date: '',
    slackChannelId: ''
  };
  let formError = '';

  $: userEntries = $birthdayEntries.filter((person) => person.source === 'user').slice().reverse();

  function moveMonth(offset: number) {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
  }

  function submitBirthday() {
    formError = '';

    if (!form.name.trim() || !form.date || !form.slackChannelId.trim()) {
      formError = 'Name, birthday, and Slack channel ID are required.';
      return;
    }

    addBirthdayEntry({
      name: form.name,
      date: form.date,
      slackChannelId: normalizeChannelId(form.slackChannelId)
    });

    currentMonth = new Date(new Date(form.date).getFullYear(), new Date(form.date).getMonth(), 1);
    form = { name: '', date: '', slackChannelId: '' };
  }
</script>

<svelte:head>
  <title>Hack Club Birthdays</title>
  <meta
    name="description"
    content="A clean Hack Club birthdays calendar with a simple form for adding birthdays and personal Slack channels."
  />
</svelte:head>

<div class="shell">
  <div class="page">
    <TopNav />

    <section class="hero glass" in:fade={{ duration: 300 }}>
      <div class="hero-copy">
        <span class="pill">
          <span class="eyebrow-dot"></span>
          Birthday board
        </span>
        <h1>One calendar. Easy to update. Worth looking at.</h1>
        <p>
          Add a birthday and personal Slack channel from the page itself, then browse the year
          without leaving the board.
        </p>
      </div>

      <form class="composer" on:submit|preventDefault={submitBirthday}>
        <div class="field-row">
          <label>
            <span>Name</span>
            <input bind:value={form.name} placeholder="Your name" />
          </label>
          <label>
            <span>Birthday</span>
            <input bind:value={form.date} type="date" />
          </label>
        </div>

        <label>
          <span>Personal Slack channel ID</span>
          <input bind:value={form.slackChannelId} placeholder="C0123456789" />
        </label>

        {#if form.slackChannelId.trim()}
          <p class="preview">
            <span>Slack link</span>
            <a href={getSlackChannelUrl(form.slackChannelId) ?? '#'} target="_blank" rel="noreferrer">
              {getSlackChannelUrl(form.slackChannelId)}
            </a>
          </p>
        {/if}

        {#if formError}
          <p class="error">{formError}</p>
        {/if}

        <div class="composer-footer">
          <button class="save" type="submit">Save birthday</button>
          <p>{$birthdayEntries.length} total birthdays</p>
        </div>
      </form>
    </section>

    <section class="toolbar">
      <div class="month-switcher glass">
        <button aria-label="Previous month" on:click={() => moveMonth(-1)}>←</button>
        <div>
          <span>Viewing</span>
          <strong>
            {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </strong>
        </div>
        <button aria-label="Next month" on:click={() => moveMonth(1)}>→</button>
      </div>

      {#if userEntries[0]}
        <div class="latest glass">
          <span>Latest addition</span>
          <strong>{userEntries[0].name}</strong>
        </div>
      {/if}
    </section>

    <MonthCalendar entries={$birthdayEntries} month={currentMonth} />
  </div>
</div>

<style>
  .hero {
    display: grid;
    grid-template-columns: 1fr 1.05fr;
    gap: 1rem;
    padding: 1.15rem;
    border-radius: 1.6rem;
    margin-bottom: 1rem;
  }

  .hero-copy {
    padding: 0.35rem;
  }

  .hero-copy h1 {
    margin: 0.85rem 0 0.7rem;
    font-family: var(--display);
    font-size: clamp(2.8rem, 6vw, 4.8rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
  }

  .hero-copy p {
    margin: 0;
    max-width: 34rem;
    color: var(--muted);
    font-size: 1.02rem;
    line-height: 1.7;
  }

  .composer {
    display: grid;
    gap: 0.85rem;
    padding: 1rem;
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid var(--line);
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 0.8fr;
    gap: 0.75rem;
  }

  label {
    display: grid;
    gap: 0.42rem;
  }

  label span,
  .preview span,
  .month-switcher span,
  .latest span {
    color: var(--muted);
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  input {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: 0.95rem;
    background: rgba(255, 255, 255, 0.03);
    color: var(--text);
    padding: 0.9rem 0.95rem;
    outline: none;
  }

  input:focus {
    border-color: rgba(240, 198, 116, 0.34);
    box-shadow: 0 0 0 3px rgba(240, 198, 116, 0.08);
  }

  .preview,
  .error,
  .composer-footer p {
    margin: 0;
  }

  .preview {
    display: grid;
    gap: 0.25rem;
  }

  .preview a {
    color: var(--cyan);
    overflow-wrap: anywhere;
  }

  .error {
    color: var(--rose);
  }

  .composer-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .composer-footer p {
    color: var(--muted);
    font-size: 0.92rem;
  }

  .save,
  .month-switcher button {
    border: 0;
    cursor: pointer;
    font: inherit;
  }

  .save {
    border-radius: 999px;
    padding: 0.88rem 1.2rem;
    color: #16131d;
    font-weight: 800;
    background: linear-gradient(135deg, var(--gold), var(--gold-soft));
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .month-switcher,
  .latest {
    display: flex;
    align-items: center;
    gap: 0.95rem;
    padding: 0.7rem 0.85rem;
    border-radius: 1rem;
  }

  .month-switcher button {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 999px;
    color: var(--text);
    background: rgba(255, 255, 255, 0.05);
  }

  .month-switcher strong,
  .latest strong {
    display: block;
    margin-top: 0.12rem;
  }

  .latest {
    min-width: 12rem;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
  }

  @media (max-width: 900px) {
    .hero,
    .field-row {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .toolbar,
    .composer-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .latest {
      min-width: 0;
    }
  }
</style>
