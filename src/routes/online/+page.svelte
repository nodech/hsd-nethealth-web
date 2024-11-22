<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { NodesGeneralStatusList } from '$lib/types';
  import { NODES_ONLINE } from '$lib/files/nodes-general';
  import { fetchFile } from '$lib/utils/fetch';
  import { page } from '$app/stores';
  import { NodeEntry } from '$lib/entry';
  import { nodes } from '$lib/stores/general';

  import type { Filters, OnlineInfo } from './types';
  import { getFilters, filterCheck } from './utils';
  import Item from './Item.svelte';
  import FiltersEl from './Filters.svelte';


  let onlineInterval = null as (ReturnType<typeof setInterval> | null);
  let loading = true;
  let err: string | null = null;
  let data: { data: NodesGeneralStatusList } | null = null;
  let list: OnlineInfo[] = [];
  let finalList: OnlineInfo[] = [];
  let filters: Filters;

  const data2list = (data: NodesGeneralStatusList): OnlineInfo[] => {
    const final:OnlineInfo[] = [];

    for (const [host, ports2data] of Object.entries(data)) {
      for (const [port, data] of Object.entries(ports2data)) {
        const mainSeeds = $nodes.general?.mainSeeds.statuses;
        const generatedSeeds = $nodes.general?.generatedSeeds.statuses;
        const isMainSeed = mainSeeds?.[host]?.[port];
        const isGeneratedSeed = generatedSeeds?.[host]?.[port];

        final.push({
          host,
          port,
          entry: NodeEntry.fromJSON(data.lastStatus),
          mainSeed: Boolean(isMainSeed),
          generatedSeed: Boolean(isGeneratedSeed)
        });
      }
    }

    return final;
  };

  const applyFilters = (list: OnlineInfo[], filters: Filters): OnlineInfo[] => {
    const checkSync = (info: OnlineInfo) => {
      return filterCheck(filters.sync, Boolean(info.entry.result?.canSync()));
    };

    const checkSPV = (info: OnlineInfo) => {
      return filterCheck(filters.spv, Boolean(info.entry.result?.hasBloom()));
    };

    const checkFullnode = (info: OnlineInfo) => {
      return filterCheck(filters.fullnode, Boolean(!info.entry.result?.pruned));
    };

    const checkTree = (info: OnlineInfo) => {
      return filterCheck(filters.tree, Boolean(!info.entry.result?.treeCompacted));
    };

    const mainSeed = (info: OnlineInfo) => {
      return filterCheck(filters.main, info.mainSeed);
    };

    const generatedSeed = (info: OnlineInfo) => {
      return filterCheck(filters.generated, info.generatedSeed);
    };

    const checkBrontide = (info: OnlineInfo) => {
      return filterCheck(filters.brontide, info.entry.brontide);
    };

    return list
      .filter(checkSync)
      .filter(checkSPV)
      .filter(checkFullnode)
      .filter(checkTree)
      .filter(mainSeed)
      .filter(generatedSeed)
      .filter(checkBrontide);
  };

  const applySort = (list: OnlineInfo[]): OnlineInfo[] => {
    return list;
  };

  const fetchOnline = async () => {
    try {
      data = await fetchFile(NODES_ONLINE);

      if (!data)
        throw new Error('No data');

      list = data2list(data.data);
      finalList = applySort(applyFilters(list, filters));
    } catch (e) {
      err = e.message || 'Failed';
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    onlineInterval = setInterval(() => {
      fetchOnline().catch(console.error);
    }, NODES_ONLINE.REFETCH_INTERVAL);
  });

  onDestroy(() => {
    if (onlineInterval)
      clearInterval(onlineInterval);
  });

  fetchOnline().catch(console.error);

  $: {
    filters = getFilters($page.url.hash);
  }

  $: {
    finalList = applySort(applyFilters(list, filters));
  }
</script>

<div class="min-h-14 flex items-center justify-center text-2xl font-bold">
  Online Nodes
</div>
{#if loading}
  <div class="text-center">Loading...</div>
{:else if err}
  <div class="text-left text-red-500">{err}</div>
{:else if data}

<FiltersEl
  filtered={finalList.length}
  total={list.length}
  filters={filters} />

<div class="md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-2 xl:gap-4">
  {#each finalList as { host, port, entry, mainSeed, generatedSeed }}
    <Item
      ip={host}
      port={port}
      entry={entry}
      isMainSeed={mainSeed}
      isGeneratedSeed={generatedSeed} />
  {/each}
</div>
{/if}
