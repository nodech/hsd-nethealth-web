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

  import { isStale } from '$lib/utils/time';
  import { fetchFile } from '$lib/utils/fetch';

  import { DNS_GENERAL, NODES_GENERAL } from '$lib/files';

  import HSDLogo from '$lib/components/Logos/HSD.svelte';
  import Status from './Status.svelte';

  import { dns, nodes } from '$lib/stores/general';

  let dnsInterval = null as (ReturnType<typeof setInterval> | null)
  let nodesInterval = null as (ReturnType<typeof setInterval> | null)

  const fetchDNS = async () => {
    $dns.loading = true;

    try {
      const data = await fetchFile(DNS_GENERAL);
      $dns.general = data;
    } finally {
      $dns.loading = false;
    }
  };

  const fetchNodes = async () => {
    $nodes.loading = true;

    try {
      const data = await fetchFile(NODES_GENERAL);
      $nodes.general = data;
    } finally {
      $nodes.loading = false;
    }
  };


  const fetchAll = async () => {
    return Promise.all([
      fetchDNS(),
      fetchNodes()
    ]);
  };

  fetchAll().catch(console.error);

  onMount(() => {
    setInitialClassState();

    if (DNS_GENERAL.REFETCH_INTERVAL > 0) {
      dnsInterval = setInterval(() => {
        fetchDNS().catch(console.error);
      }, DNS_GENERAL.REFETCH_INTERVAL);
    }

    if (NODES_GENERAL.REFETCH_INTERVAL > 0) {
      nodesInterval = setInterval(() => {
        fetchNodes().catch(console.error);
      }, NODES_GENERAL.REFETCH_INTERVAL);
    }
  });

  onDestroy(() => {
    if (dnsInterval)
      clearInterval(dnsInterval);

    if (nodesInterval)
      clearInterval(nodesInterval);
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
          {#if $nodes.general?.upCounts?.total}
            <span
              class:text-green-500={!isStale($nodes?.general?.timestamp)}
            > {$nodes?.general?.upCounts?.total}</span>
          {:else}
            -
          {/if}
        </span>
      </svelte:fragment>
      {#if $nodes.loading || $dns.loading}
        <ConicGradient width="w-5 space-y-0" stops={conicStops} spin />
      {/if}
      <svelte:fragment slot="trail">
        <Status nodes={$nodes.general} dns={$dns.general} />
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
