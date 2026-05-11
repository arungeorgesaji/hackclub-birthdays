<script lang="ts">
</script>

<nav class="nav glass">
  <a class="brand" href="/">
    <span class="brand-mark"></span>
    <span>Hack Club Birthdays</span>
  </a>

  <p class="note">A shared birthday board for Hack Club.</p>
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
    gap: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .brand-mark {
    width: 0.85rem;
    height: 0.85rem;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--gold), #f3e4b4);
    box-shadow: 0 0 16px rgba(243, 228, 180, 0.28);
  }

  .note {
    margin: 0;
    color: var(--muted);
    font-size: 0.95rem;
  }

  @media (max-width: 720px) {
    .nav {
      flex-direction: column;
      align-items: flex-start;
    }

    .note {
      font-size: 0.9rem;
    }
  }
</style>
