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
    setInitialClassState
  } from '@skeletonlabs/skeleton';

  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  import type { NodesGeneral, DNSGeneral } from '$lib/files';

  import { fetchFile } from '$lib/utils/fetch';
  import HSDLogo from '$lib/components/Logos/HSD.svelte';
  import { DNS_GENERAL, NODES_GENERAL } from '$lib/files';

  import Status from './Status.svelte';

  const nodesStatusLoading = writable(true);
  const dnsStatusLoading = writable(true);
  const nodesGeneral = writable(null as (NodesGeneral | null));
  const dnsGeneral = writable(null as (DNSGeneral | null));
  let intervalDNS: ReturnType<typeof setInterval>;
  let intervalNodes: ReturnType<typeof setInterval>;

  const fetchDNSGeneral = async () => {
    $dnsStatusLoading = true;

    try {
      const data = await fetchFile(DNS_GENERAL)
      $dnsGeneral = data;
    } finally {
      $dnsStatusLoading = false;
    }
  };

  const fetchGeneral = async () => {
    $nodesStatusLoading = true;

    try {
      const data = await fetchFile(NODES_GENERAL)
      $nodesGeneral = data;
    } finally {
      $nodesStatusLoading = false;
    }
  };

  const fetchAll = async () => {
    return Promise.all([
      fetchDNSGeneral(),
      fetchGeneral()
    ]);
  };

  fetchAll().catch(console.error);

  onMount(() => {
    setInitialClassState();

    if (DNS_GENERAL.REFETCH_INTERVAL > 0) {
      intervalDNS = setInterval(() => {
        fetchDNSGeneral().catch(console.error);
      }, DNS_GENERAL.REFETCH_INTERVAL);
    }

    if (NODES_GENERAL.REFETCH_INTERVAL > 0) {
      intervalNodes = setInterval(() => {
        fetchGeneral().catch(console.error);
      }, NODES_GENERAL.REFETCH_INTERVAL);
    }
  });

  onDestroy(() => {
    clearInterval(intervalDNS);
    clearInterval(intervalNodes);
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
          {#if $nodesGeneral?.reachable}
            <span class="text-green-500">{$nodesGeneral?.reachable}</span>
          {:else}
            -
          {/if}
        </span>
      </svelte:fragment>
      {#if $nodesStatusLoading || $dnsStatusLoading}
        <ConicGradient width="w-5 space-y-0" stops={conicStops} spin />
      {/if}
      <svelte:fragment slot="trail">
        <Status nodes={$nodesGeneral} dns={$dnsGeneral} />
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
