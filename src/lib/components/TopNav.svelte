<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  export let session: { name: string; pfp: string } | null = null;

  const modeStorageKey = 'hcbday-mode';
  const themeStorageKey = 'hcbday-theme';
  const themes = [
    { id: 'signal', label: 'Signal Blue', swatches: ['#7aa2ff', '#8abbe8'] },
    { id: 'slate', label: 'Slate', swatches: ['#91a3bc', '#9db4cb'] },
    { id: 'graphite', label: 'Graphite', swatches: ['#d1b07a', '#9eb8c0'] },
    { id: 'ember', label: 'Ember', swatches: ['#e78d5a', '#d3886f'] },
    { id: 'orchid', label: 'Orchid', swatches: ['#9585eb', '#8edee4'] },
    { id: 'moss', label: 'Moss', swatches: ['#7da787', '#9cb8ab'] }
  ] as const;
  type ThemeId = (typeof themes)[number]['id'];
  type ModeId = 'dark' | 'light';

  let activeMode: ModeId = 'dark';
  let activeTheme: ThemeId = 'signal';
  let themeMenuOpen = false;
  let themeMenuElement: HTMLDivElement | null = null;

  $: activeThemeMeta = themes.find((theme) => theme.id === activeTheme) ?? themes[0];

  function setMode(modeId: ModeId) {
    activeMode = modeId;

    if (!browser) {
      return;
    }

    document.documentElement.dataset.mode = modeId;
    localStorage.setItem(modeStorageKey, modeId);
  }

  function setTheme(themeId: ThemeId) {
    activeTheme = themeId;

    if (!browser) {
      return;
    }

    document.documentElement.dataset.theme = themeId;
    localStorage.setItem(themeStorageKey, themeId);
  }

  function handleDocumentPointerDown(event: PointerEvent) {
    if (!themeMenuOpen || !themeMenuElement) {
      return;
    }

    const target = event.target;

    if (target instanceof Node && !themeMenuElement.contains(target)) {
      themeMenuOpen = false;
    }
  }

  onMount(() => {
    const storedMode = localStorage.getItem(modeStorageKey);
    const storedTheme = localStorage.getItem(themeStorageKey);

    if (storedMode === 'dark' || storedMode === 'light') {
      setMode(storedMode);
    } else {
      setMode(activeMode);
    }

    if (storedTheme && themes.some((theme) => theme.id === storedTheme)) {
      setTheme(storedTheme as ThemeId);
      return;
    }

    setTheme(activeTheme);

    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
    };
  });
</script>

<nav class="nav glass">
  <div class="intro">
    <a class="brand" href="/">
      <span>Hack Club Birthdays</span>
    </a>
    <p class="note">A shared birthday board for hackclub members.</p>
  </div>

  <div class="controls">
    <div class="mode-switcher">
      <span>Tone</span>
      <div class="mode-toggle">
        <button
          type="button"
          class:active={activeMode === 'dark'}
          aria-label="Use night tone"
          onclick={() => setMode('dark')}
        >
          Night
        </button>
        <button
          type="button"
          class:active={activeMode === 'light'}
          aria-label="Use paper tone"
          onclick={() => setMode('light')}
        >
          Paper
        </button>
      </div>
    </div>

    <div class="theme-switcher">
      <span>Theme</span>
      <div class="theme-menu" bind:this={themeMenuElement}>
        <button
          type="button"
          class="theme-trigger"
          aria-expanded={themeMenuOpen}
          aria-label="Open theme picker"
          onclick={() => (themeMenuOpen = !themeMenuOpen)}
        >
          <span class="theme-preview">
            {#each activeThemeMeta.swatches as swatch}
              <span class="swatch" style={`background:${swatch}`}></span>
            {/each}
          </span>
        </button>

        {#if themeMenuOpen}
          <div class="theme-popover glass">
            <div class="theme-grid">
              {#each themes as theme}
                <button
                  type="button"
                  class:active={theme.id === activeTheme}
                  class="theme-option"
                  aria-label={`Switch to ${theme.label}`}
                  title={theme.label}
                  aria-pressed={theme.id === activeTheme}
                  onclick={() => setTheme(theme.id)}
                >
                  {#each theme.swatches as swatch}
                    <span class="swatch" style={`background:${swatch}`}></span>
                  {/each}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
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
    position: relative;
    z-index: 30;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 1.25rem;
    margin-bottom: 1rem;
    animation: rise 0.7s ease both;
  }

  .intro {
    display: grid;
    gap: 0.22rem;
    min-width: 0;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .mode-switcher,
  .theme-switcher {
    display: inline-grid;
    gap: 0.32rem;
    color: var(--muted);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .mode-toggle {
    display: inline-flex;
    padding: 0.22rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.03);
  }

  .mode-toggle button {
    border: 0;
    background: transparent;
    color: var(--muted);
    padding: 0.35rem 0.72rem;
    border-radius: 999px;
    cursor: pointer;
    transition:
      background 180ms ease,
      color 180ms ease;
  }

  .mode-toggle button.active {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text);
  }

  .theme-menu {
    position: relative;
    z-index: 40;
  }

  .theme-trigger,
  .theme-option {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.26rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.03);
    font: inherit;
    padding: 0.45rem 0.55rem;
    outline: none;
    cursor: pointer;
    transition:
      border-color 180ms ease,
      background 180ms ease,
      transform 180ms ease;
  }

  .theme-trigger:focus,
  .theme-option:focus {
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
  }

  .theme-trigger:hover,
  .theme-option:hover,
  .theme-option.active {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
  }

  .theme-popover {
    position: absolute;
    top: calc(100% + 0.55rem);
    right: 0;
    padding: 0.6rem;
    border-radius: 1rem;
    z-index: 50;
  }

  .theme-grid {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 0.45rem;
  }

  .theme-preview {
    display: inline-flex;
    gap: 0.26rem;
  }

  .swatch {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .note {
    margin: 0;
    color: var(--muted);
    font-size: 0.88rem;
    min-width: 0;
    line-height: 1.35;
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

    .controls {
      width: 100%;
      justify-content: flex-start;
    }

    .note {
      font-size: 0.9rem;
    }
  }
</style>
