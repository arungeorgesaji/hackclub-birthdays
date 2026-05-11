<script lang="ts">
  export let session: { name: string; pfp: string } | null = null;
</script>

<nav class="nav glass">
  <a class="brand" href="/">
    <span>Hack Club Birthdays</span>
  </a>

  <div class="meta">
    <p class="note">A shared birthday board for hackclub members.</p>
    {#if session}
      <div class="user">
        <img src={session.pfp} alt={session.name} />
        <span>@{session.name}</span>
      </div>
    {/if}
  </div>
</nav>

<style>
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 1.25rem;
    margin-bottom: 1rem;
    animation: rise 0.7s ease both;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .note {
    margin: 0;
    color: var(--muted);
    font-size: 0.95rem;
  }

  .user {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }

  .user img {
    width: 1.9rem;
    height: 1.9rem;
    border-radius: 999px;
    object-fit: cover;
  }

  .user span {
    font-size: 0.9rem;
  }

  @media (max-width: 720px) {
    .nav {
      flex-direction: column;
      align-items: flex-start;
    }

    .meta {
      flex-direction: column;
      align-items: flex-start;
    }

    .note {
      font-size: 0.9rem;
    }
  }
</style>
