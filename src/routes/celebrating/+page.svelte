<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import TopNav from '$lib/components/TopNav.svelte';
  import { getSlackChannelUrl } from '$lib/utils/slack';
  import { formatBirthdayLabel, getUpcomingBirthdays } from '$lib/utils/calendar';

  export let data: {
    session: { id: string; name: string; pfp: string } | null;
    birthdays: import('$lib/data/birthdays').BirthdayPerson[];
  };

  const now = new Date();
  $: lineup = getUpcomingBirthdays(data.birthdays, now, 8);
</script>

<svelte:head>
  <title>Celebrating Now · Hack Club Birthdays</title>
</svelte:head>

<div class="shell">
  <div class="page">
    <TopNav session={data.session} />

    <section class="headline glass" in:fade={{ duration: 420 }}>
      <span class="pill">
        <span class="eyebrow-dot"></span>
        Celebration queue
      </span>

      <h1>The next wave of birthdays, staged like a lineup poster.</h1>
      <p>
        When birthdays are close, the page should feel alive. This view turns the next run of
        celebrations into a sequence of loud, confident cards instead of buried calendar metadata.
      </p>
    </section>

    <section class="lineup">
      {#each lineup as person, index}
        <article class="lineup-card glass" in:fly={{ y: 26, duration: 340, delay: index * 70 }}>
          <div class="left">
            <span class="days">{person.daysAway === 0 ? 'Today' : `${person.daysAway} days`}</span>
            <h2>{person.name}</h2>
          </div>

          <div class="right">
            <strong>{formatBirthdayLabel(person.date)}</strong>
            {#if person.slackChannelId}
              <a class="slack-link" href={getSlackChannelUrl(person.slackChannelId) ?? '#'} target="_blank" rel="noreferrer">
                Open personal Slack channel
              </a>
            {/if}
          </div>
        </article>
      {/each}
    </section>
  </div>
</div>

<style>
  .headline,
  .lineup-card {
    border-radius: 2rem;
  }

  .headline {
    padding: 1.35rem;
    margin-bottom: 1rem;
  }

  .headline h1 {
    margin: 1rem 0 0.8rem;
    font-family: var(--display);
    font-size: clamp(3rem, 8vw, 5rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
  }

  .headline p {
    margin: 0;
    color: var(--muted);
    line-height: 1.65;
  }

  .lineup {
    display: grid;
    gap: 1rem;
  }

  .lineup-card {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
    padding: 1.25rem;
    transition: transform 180ms ease;
  }

  .lineup-card:hover {
    transform: translateY(-3px);
  }

  .days {
    display: inline-flex;
    border-radius: 999px;
    padding: 0.4rem 0.7rem;
    color: #091018;
    background: linear-gradient(135deg, var(--gold), var(--mint));
    font-weight: 800;
    margin-bottom: 0.9rem;
  }

  .left h2,
  .right strong {
    margin: 0 0 0.3rem;
  }

  .left h2 {
    font-size: clamp(1.8rem, 3vw, 2.6rem);
  }

  .right {
    max-width: 25rem;
    text-align: right;
  }

  .right strong {
    display: block;
    font-size: 1.15rem;
  }

  .slack-link {
    display: inline-block;
    margin-top: 0.6rem;
    color: var(--cyan);
  }

  @media (max-width: 760px) {
    .lineup-card {
      grid-template-columns: 1fr;
    }

    .right {
      text-align: left;
    }
  }
</style>
