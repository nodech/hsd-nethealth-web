<script lang="ts">
  import { onMount } from 'svelte';
  import { invalidate } from '$app/navigation';

  import { ProgressRadial } from '@skeletonlabs/skeleton';

  import { MAIN_PAGE } from '$lib/files';

  export let data;

  onMount(() => {
    setInterval(() => {
      invalidate(MAIN_PAGE.ID);
    }, MAIN_PAGE.REFETCH_INTERVAL);
  });
</script>

{#if !data.main}
  <div class="flex justify-center">
    <ProgressRadial class="w-10 h-10 mt-5 justify-center" />
  </div>
{:else}
  Data loaded: {JSON.stringify(data)}
{/if}
