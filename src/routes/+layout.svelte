<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import { initBirthdayEntries } from '$lib/stores/birthdays';

  onMount(() => {
    initBirthdayEntries();
  });
</script>

<slot />
