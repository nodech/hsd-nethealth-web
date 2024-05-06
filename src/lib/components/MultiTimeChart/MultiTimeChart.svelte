<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    RadioGroup,
    RadioItem,
  } from '@skeletonlabs/skeleton';

  import type {
    ViewDefinition,
    ViewLabel,
    ViewMap
  } from './MultiTimeChart';

  import type {
    TimeChartOptions,
    TimeChartData
  } from '$lib/components/TimeChart/TimeChart';

  import { timeChartOptions } from '$lib/components/TimeChart/TimeChart';
  import TimeChart from '$lib/components/TimeChart/TimeChart.svelte';

  import { fetchFile } from '$lib/utils/fetch';
  import type { FileDefinition } from '$lib/files/types';
  import type { TimeEntries } from '$lib/types';

  // Props.
  export let title: string;
  export let defaultView: ViewLabel;
  export let views: ViewMap;

  const viewNames: ViewLabel[] = Object.keys(views);

  if (!viewNames.length) {
    throw new Error('No views provided');
  }

  const timeChartDefaults: TimeChartOptions = timeChartOptions({
    style: {
      height: 300
    },
    YAxis: {
      label: ' ',
      style: {
        marginRight: 40,
        fontSize: 11
      }
    },
    XAxis: {
      style: {
        marginBottom: 60,
        tickWidth: 10
      }
    }
  });

  let selectedViewName: ViewLabel = defaultView;
  let selectedView: ViewDefinition = views[selectedViewName];
  let lastMaxValue: number = 0;
  let loadState: {
    interval: ReturnType<typeof setInterval> | null;
    data: TimeChartData | null;
    loading: boolean;
    controller: AbortController;
  } = {
    interval: null,
    data: null,
    loading: true,
    controller: new AbortController()
  };

  let selectedTimeChartOptions: TimeChartOptions;

  function selectView(view: ViewLabel) {
    selectedViewName = view;
    selectedView = views[view];

    if (selectedView) {
      selectedTimeChartOptions = timeChartOptions(
        selectedView.generalOptions,
        timeChartDefaults
      );

      selectedTimeChartOptions.XAxis.min = selectedView.getMinTimeFn();
      selectedTimeChartOptions.XAxis.tickSize = selectedView.tickSize;
      selectedTimeChartOptions.XAxis.formatFn = selectedView.timeFormatFn;
      selectedTimeChartOptions.YAxis.maxValue = lastMaxValue;
    }
  }

  if (!selectedView && viewNames.length > 0) {
    selectView(viewNames[0]);
  } else if (selectView) {
    selectView(selectedViewName);
  }

  selectedTimeChartOptions = timeChartOptions(
    selectedView.generalOptions,
    timeChartDefaults
  );

  function data2TimeChart(data: TimeEntries): TimeChartData {
    const outData: TimeChartData = {
      online: {
        style: {
          stroke: 'green'
        },
        data: data.data
      }
    };

    return outData;
  }

  async function fetchData(fileDef: FileDefinition) {
    loadState.loading = true;
    loadState.controller.abort();
    loadState.controller = new AbortController();
    const signal = loadState.controller.signal;

    try {
      const out: TimeEntries = await fetchFile(fileDef, undefined, signal);
      lastMaxValue = selectedView.getMaxValueFn(out);
      selectedTimeChartOptions.YAxis.maxValue = lastMaxValue;

      loadState.data = data2TimeChart(out);
    } finally {
      loadState.loading = false;
      loadState.controller = new AbortController();
    }
  }

  $: {
    selectView(selectedViewName);
  }

  $: {
    fetchData(selectedView.fileDefinition).catch(console.error);
  }

  onMount(() => {
    loadState.interval = setInterval(() => {
      fetchData(selectedView.fileDefinition).catch(console.error);
    }, selectedView.fileDefinition.REFETCH_INTERVAL);
  });

  onDestroy(() => {
    if (loadState.controller) {
      loadState.controller.abort();
    }

    if (loadState.interval)
      clearInterval(loadState.interval);
  });
</script>

<div class="flex justify-end items-center w-full">
  <div class="mx-auto text-2xl font-bold">{title}</div>
  <div class="flex flex-nowrap">
    <div class="flex-initial grow-0">
      <RadioGroup display="flex" border="border-token border-surface-200-700-token" background="">
        {#each Object.keys(views) as viewName}
          <RadioItem
            active="variant-ghost-primary"
            hover="hover:variant-soft-primary"
            bind:group={selectedViewName}
            name="view"
            value={viewName}
          >
            {views[viewName].name}
          </RadioItem>
        {/each}
      </RadioGroup>
    </div>
  </div>
</div>

{#if loadState.data}
  <TimeChart 
    options={selectedTimeChartOptions}
    data={loadState.data}
    loading={loadState.loading}
  />
{/if}
