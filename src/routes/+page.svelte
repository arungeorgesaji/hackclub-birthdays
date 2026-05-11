<script lang="ts">
  import { fade } from 'svelte/transition';
  import { enhance } from '$app/forms';
  import MonthCalendar from '$lib/components/MonthCalendar.svelte';
  import TopNav from '$lib/components/TopNav.svelte';
  import { getSlackChannelUrl } from '$lib/utils/slack';
  import { formatBirthdayLabel } from '$lib/utils/calendar';

  export let data: {
    session: { id: string; name: string; pfp: string } | null;
    currentUser: {
      bday_month: number | null;
      bday_day: number | null;
      channel_id: string | null;
    } | null;
    birthdays: import('$lib/data/birthdays').BirthdayPerson[];
  };
  export let form: { error?: string; success?: boolean } | null;

  const now = new Date();
  let currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  let currentUser = data.currentUser;
  let birthdayForm = {
    birthday: '',
    slackChannelId: currentUser?.channel_id ?? ''
  };
  let birthdayParts = {
    month: '',
    day: ''
  };
  let composerOpen = false;
  let actionError = form?.error ?? '';
  let currentUserBirthdayLabel: string | null = null;

  if (currentUser && currentUser.bday_month !== null && currentUser.bday_day !== null) {
    birthdayForm.birthday = formatBirthdayInput(currentUser.bday_month, currentUser.bday_day);
    birthdayParts.month = String(currentUser.bday_month + 1).padStart(2, '0');
    birthdayParts.day = String(currentUser.bday_day).padStart(2, '0');
    currentUserBirthdayLabel = formatBirthdayLabel(
      formatBirthdayInput(currentUser.bday_month, currentUser.bday_day)
    );
  }

  function moveMonth(offset: number) {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
  }

  function formatBirthdayInput(month: number, day: number) {
    return `2000-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function syncBirthdayField() {
    birthdayParts.month = birthdayParts.month.replace(/\D/g, '').slice(0, 2);
    birthdayParts.day = birthdayParts.day.replace(/\D/g, '').slice(0, 2);

    if (!birthdayParts.month || !birthdayParts.day) {
      birthdayForm.birthday = '';
      return;
    }

    const month = Number(birthdayParts.month);
    const day = Number(birthdayParts.day);

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      birthdayForm.birthday = '';
      return;
    }

    birthdayForm.birthday = `2000-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  syncBirthdayField();
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
    <TopNav session={data.session} />

    <section class="toolbar" in:fade={{ duration: 300 }}>
      <button class="add-trigger glass" type="button" onclick={() => (composerOpen = true)}>
        <span class="pill">Birthday board</span>
        <strong>Edit my birthday</strong>
      </button>

      <div class="month-switcher glass">
        <button aria-label="Previous month" onclick={() => moveMonth(-1)}>←</button>
        <div>
          <span>Viewing</span>
          <strong>
            {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </strong>
        </div>
        <button aria-label="Next month" onclick={() => moveMonth(1)}>→</button>
      </div>

      {#if currentUserBirthdayLabel}
        <div class="latest glass">
          <span>Your birthday</span>
          <strong>{currentUserBirthdayLabel}</strong>
        </div>
      {/if}
    </section>

    <MonthCalendar entries={data.birthdays} month={currentMonth} />

    {#if composerOpen}
      <button class="composer-backdrop" type="button" aria-label="Close" onclick={() => (composerOpen = false)}></button>
      <div class="composer-modal glass" in:fade={{ duration: 180 }}>
        <div class="composer-head">
          <div>
            <p>Edit birthday</p>
            <strong>Save your birthday and Slack channel.</strong>
          </div>
          <button class="close" type="button" aria-label="Close" onclick={() => (composerOpen = false)}>
            ×
          </button>
        </div>

        <form
          class="composer"
          method="POST"
          action="?/saveBirthday"
          use:enhance={({ formElement }) => {
            actionError = '';

            return async ({ result, update }) => {
              await update();

              if (result.type === 'success') {
                composerOpen = false;
              } else if (result.type === 'failure') {
                actionError =
                  typeof result.data === 'object' && result.data && 'error' in result.data
                    ? String(result.data.error)
                    : 'Could not save birthday.';
              }
            };
          }}
        >
          <div class="field-row single">
            <label>
              <span>Birthday</span>
              <div class="birthday-inputs">
                <input
                  bind:value={birthdayParts.month}
                  aria-label="Birth month"
                  type="text"
                  inputmode="numeric"
                  maxlength="2"
                  placeholder="Month"
                  oninput={syncBirthdayField}
                />
                <span>/</span>
                <input
                  bind:value={birthdayParts.day}
                  aria-label="Birth day"
                  type="text"
                  inputmode="numeric"
                  maxlength="2"
                  placeholder="Day"
                  oninput={syncBirthdayField}
                />
              </div>
              <input bind:value={birthdayForm.birthday} name="birthday" type="hidden" />
            </label>
          </div>

          <label>
            <span>Slack channel ID</span>
            <input bind:value={birthdayForm.slackChannelId} name="slackChannelId" placeholder="C0123456789" />
          </label>

          {#if birthdayForm.slackChannelId.trim()}
            <p class="preview">
              <a href={getSlackChannelUrl(birthdayForm.slackChannelId) ?? '#'} target="_blank" rel="noreferrer">
                {getSlackChannelUrl(birthdayForm.slackChannelId)}
              </a>
            </p>
          {/if}

          {#if actionError}
            <p class="error">{actionError}</p>
          {/if}

          <div class="composer-footer">
            <button class="save" type="submit">Save</button>
          </div>
        </form>
      </div>
    {/if}
  </div>
</div>

<style>
  .add-trigger {
    display: grid;
    gap: 0.7rem;
    justify-items: start;
    min-width: 18rem;
    padding: 0.9rem 1rem;
    border: 0;
    cursor: pointer;
    border-radius: 1rem;
    color: var(--text);
    text-align: left;
  }

  .add-trigger strong {
    font-size: 1rem;
    font-weight: 600;
  }

  .composer {
    display: grid;
    gap: 0.75rem;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 0.8fr;
    gap: 0.75rem;
  }

  .field-row.single {
    grid-template-columns: 1fr;
  }

  label {
    display: grid;
    gap: 0.42rem;
  }

  label span,
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
  .error {
    margin: 0;
  }

  .birthday-inputs {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 0.65rem;
  }

  .birthday-inputs span {
    color: var(--muted);
    font-size: 0.95rem;
    text-align: center;
    opacity: 0.8;
  }

  .birthday-inputs input {
    min-width: 0;
    text-align: center;
    padding-inline: 0.75rem;
  }

  .preview {
    font-size: 0.82rem;
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

  .save,
  .month-switcher button {
    border: 0;
    cursor: pointer;
    font: inherit;
  }

  .save {
    border-radius: 999px;
    padding: 0.78rem 1.1rem;
    color: #16131d;
    font-weight: 800;
    background: linear-gradient(135deg, var(--gold), var(--gold-soft));
  }

  .toolbar {
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: start;
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

  .composer-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(7, 6, 10, 0.55);
    backdrop-filter: blur(6px);
    z-index: 20;
  }

  .composer-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 21;
    width: min(42rem, calc(100vw - 1.5rem));
    padding: 1rem;
    border-radius: 1.2rem;
    transform: translate(-50%, -50%);
  }

  .composer-head {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.9rem;
  }

  .composer-head p,
  .composer-head strong {
    margin: 0;
  }

  .composer-head p {
    color: var(--muted);
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .composer-head strong {
    display: block;
    margin-top: 0.3rem;
    font-size: 1.1rem;
  }

  .close {
    width: 2.3rem;
    height: 2.3rem;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--text);
    cursor: pointer;
    font-size: 1.35rem;
    line-height: 1;
  }

  @media (max-width: 720px) {
    .toolbar,
    .field-row,
    .composer-footer {
      grid-template-columns: 1fr;
    }

    .toolbar {
      grid-template-columns: 1fr;
    }

    .add-trigger,
    .month-switcher {
      width: 100%;
    }

    .latest {
      min-width: 0;
    }
  }
</style>
