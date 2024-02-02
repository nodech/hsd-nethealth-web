<script lang="ts">
  import '../app.postcss';
  import '@fortawesome/fontawesome-free/css/fontawesome.css';
  import '@fortawesome/fontawesome-free/css/brands.css';

  import type { ConicStop } from '@skeletonlabs/skeleton';
  import {
    AppShell,
    AppBar,
    LightSwitch,
    ConicGradient,
    setInitialClassState,
  } from '@skeletonlabs/skeleton';

  import { setContext, onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  import type { GeneralStatuses } from '$lib/files';

  import { fetchFile } from '$lib/utils/fetch';
  import HSDLogo from '$lib/components/Logos/HSD.svelte';
  import { GENERAL_STATUSES } from '$lib/files';

  import Status from './Status.svelte';

  const generalStatusLoading = writable(true);
  const generalStatus = writable(null as (GeneralStatuses | null));

  const fetchGeneral = () => {
    $generalStatusLoading = true;

    fetchFile(GENERAL_STATUSES)
      .then((response) => response.json())
      .then((data) => {
        $generalStatus = data;
        $generalStatusLoading = false;
      })
      .catch((error) => console.error(error));
  };

  const interval = setInterval(fetchGeneral, GENERAL_STATUSES.REFETCH_INTERVAL);
  fetchGeneral();

  setContext('generalStatus', generalStatus);
  setContext('generalStatusLoading', generalStatusLoading);

  onMount(() => {
    setInitialClassState();
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  const conicStops: ConicStop[] = [
    { color: 'transparent', start: 0, end: 25 },
    { color: 'rgb(var(--color-primary-500))', start: 75, end: 100 }
  ];
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar>
      <svelte:fragment slot="lead">
        <a href="/">
          <HSDLogo />
        </a>
        <span class="text-xl uppercase" title="Reachable Nodes">Nodes:
          {#if $generalStatus?.reachable}
            <span class="text-green-500">{$generalStatus?.reachable}</span>
          {:else}
            -
          {/if}
        </span>
      </svelte:fragment>
      {#if $generalStatusLoading}
        <ConicGradient width="w-5 space-y-0" stops={conicStops} spin />
      {/if}
      <svelte:fragment slot="trail">
        <Status data={$generalStatus} />
        <a
          class="btn-icon btn-icon-md hover:variant-soft-primary"
          href="https://github.com/nodech/hsd-nethealth-web"
          target="_blank"
          rel="noreferrer"
        >
          <i class="fa-brands fa-github text-lg" />
        </a>
        <LightSwitch />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <!-- Page Route Content -->
  <div class="container mx-auto">
    <slot />
  </div>
</AppShell>
