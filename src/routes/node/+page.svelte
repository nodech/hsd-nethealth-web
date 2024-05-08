<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import type { NodeGeneralStatuses } from './types';
  import {
    NODE,
  } from '$lib/files/node';

  import { fetchFile } from '$lib/utils/fetch';

  import Ports from './Ports.svelte';
  import GeneralStatus from './GeneralStatus.svelte';
  import GraphStatus from './GraphStatus.svelte';

  type GeneralNodeStatus = {
    general: NodeGeneralStatuses;
    ports: number[];
  };

  let loadState: {
    interval: ReturnType<typeof setInterval> | null;
    data: GeneralNodeStatus | null;
    loading: boolean;
    failed: boolean;
  } = {
    interval: null,
    data: null,
    loading: true,
    failed: false,
  };

  let host: string | null;
  let port: number = 12038;

  $: {
    host = $page.url.searchParams.get('host');
    const p = $page.url.searchParams.get('port');

    if (p) {
      port = Number(p);
    }
  }

  const fetchGeneral = async (host: string | null) => {
    if (!host) {
      return;
    }

    loadState.loading = true;
    loadState.failed = false;
    loadState.data = null;

    try {
      const data = await fetchFile(NODE, undefined, host);
      loadState.data = data;
    } catch (error) {
      console.error(error);
      loadState.failed = true;
    } finally {
      loadState.loading = false;
    }
  };

  $: {
    fetchGeneral(host).catch(console.error);
  }

  onMount(() => {
    loadState.interval = setInterval(() => {
      fetchGeneral(host).catch(console.error);
    }, NODE.REFETCH_INTERVAL);
  });

  onDestroy(() => {
    if (loadState.interval) {
      clearInterval(loadState.interval);
    }
  });

  const classes = 'm-3 md:m-0 md:mt-2';
</script>

<Ports host={host} port={port} ports={loadState?.data?.ports} />

{#if loadState.failed}
  <div class="flex justify-center">
    <p class="text-red-500">Failed to get IP address "{host}"</p>
  </div>
{:else if loadState.loading}
  <div class="flex justify-center">
    <p class="text-yellow-500">Loading IP address {host}...</p>
  </div>
{:else if loadState.data && host}
<div class="md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-2">
  <div class="{classes}">
    <div class="card">
      <GeneralStatus host={host} port={port} status={loadState.data.general} />
    </div>
  </div>
  <div class="{classes} md:col-span-1 xl:col-span-2">
    <div class="card">
      <GraphStatus host={host} port={port} />
    </div>
  </div>
</div>
{:else}
  Unknown state
{/if}
