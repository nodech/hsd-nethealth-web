<script lang="ts">
  import { onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import { ProgressBar } from '@skeletonlabs/skeleton';

  import { fetchFile } from '$lib/utils/fetch';
  import type { MainPage } from '$lib/files';
  import { MAIN_PAGE } from '$lib/files';

  import Countries from './Countries.svelte';
  import Versions from './Versions.svelte';

  const loading = writable(true);
  const main = writable(null as (MainPage | null));

  const fetchMain = () => {
    $loading = true;

    fetchFile(MAIN_PAGE)
      .then((response) => response.json())
      .then((data) => {
        $loading = false;
        $main = data;
      })
      .catch((error) => console.error(error));
  };

  setContext('mainPage', main);

  const interval = setInterval(fetchMain, MAIN_PAGE.REFETCH_INTERVAL);
  fetchMain();

  onDestroy(() => {
    clearInterval(interval);
  });

  const classes = "md:w-1/2 xl:w-1/3 card m-3";
</script>

{#if $loading}
  <div class="flex justify-center h-3">
    <ProgressBar height="h-1" />
  </div>
{/if}

<div class="md:flex">
  <div class="{classes}">
    <Countries />
  </div>
  <div class="{classes}">
    <Versions />
  </div>
</div>
