<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    RadioGroup,
    RadioItem,
  } from "@skeletonlabs/skeleton";

  import { fetchFile } from "$lib/utils/fetch";
  import {
    YEAR,
    MONTH,
    DAY,
    HOUR,
    MINUTE,
    formatDate,
    formatTime
  } from "$lib/utils/time";

  import {
    DNS_DAY_10m,
    DNS_MONTH_HOURLY,
    DNS_3MONTHS_DAILY,
    DNS_YEAR_DAILY
  } from '$lib/files';

  import type {
    FileDefinition,
    DNSDay,
    DNSMonth,
    DNS3Months,
    DNSYear
  } from '$lib/files';

  import type { TimeChartOptionsPartial, TimeChartData } from '$lib/components/Charts/TimeChart';
  import TimeChart from '$lib/components/Charts/TimeChart.svelte';


  let timeChartOptions: TimeChartOptionsPartial = {
    style: {
      height: 300
    },
    YAxis: {
      label: 'Online',
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
  };

  type View = 'day' | 'month' | '3months' | 'year'
  type Data = DNSDay | DNSMonth | DNS3Months | DNSYear;

  const formatForDay = formatTime;
  const formatForMonth = (value: number) => {
    return formatDate(value, {
      month: '2-digit',
      day: 'numeric',
      hour: 'numeric'
    });
  };

  const formatFor3Months = (value: number) => {
    return formatDate(value, {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatForYear = formatFor3Months;

  let view: View = 'month';
  let fileDef: FileDefinition;
  let data: TimeChartData | null = null;

  let controller: AbortController | null = null;
  let signal: AbortSignal | null = null;
  let tickSize = 10 * MINUTE;
  let min = Date.now() - 24 * HOUR;
  let formatFn = (value: number) => String(value);

  $: {
    switch (view) {
      case 'day':
        tickSize = 10 * MINUTE;
        min = Date.now() - 24 * HOUR;
        fileDef = DNS_DAY_10m;
        formatFn = formatForDay;
        break;
      case 'month':
        tickSize = 1 * HOUR;
        min = Date.now() - MONTH;
        fileDef = DNS_MONTH_HOURLY;
        formatFn = formatForMonth;
        break;
      case '3months':
        tickSize = 1 * DAY;
        min = Date.now() - 3 * MONTH;
        fileDef = DNS_3MONTHS_DAILY;
        formatFn = formatFor3Months;
        break;
      case 'year':
        tickSize = 1 * DAY;
        min = Date.now() - YEAR;
        fileDef = DNS_YEAR_DAILY;
        formatFn = formatForYear;
        break;
      default:
        throw new Error(`Unknown view: ${view}`);
    }
  }

  const getMaxValue = (data: Data['data']) => {
    let max = 0;

    for (const value of Object.values(data)) {
      if (value > max) {
        max = value;
      }
    }

    return max;
  };

  const data2timechart = (data: Data): TimeChartData => {
    const outData: TimeChartData = {
      online: {
        style: {
          stroke: 'green'
        },
        data: data.data
      }
    };

    return outData;
  };

  const fetchData = async (fileDef: FileDefinition) => {
    if (controller) {
      controller.abort();
    }

    controller = new AbortController();
    signal = controller.signal;

    try {
      const out = await fetchFile(fileDef, undefined, signal);
      data = data2timechart(out);

      const maxValue = getMaxValue(out.data);

      timeChartOptions.XAxis = {
        ...timeChartOptions.XAxis,
        tickSize: tickSize,
        min: min,
        formatFn: formatFn
      };

      timeChartOptions.YAxis = {
       ...timeChartOptions.YAxis,
       maxValue: maxValue,
      };

    } finally {
      controller = null;
      signal = null;
    }
  };

  $: {
    console.log('FileDef is fetching..');
    fetchData(fileDef).catch(console.error);
  }

  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    // use one interval for all.
    setInterval(() => {
      console.log('Interval is fetchign...');
      fetchData(fileDef).catch(console.error);
    }, DNS_DAY_10m.REFETCH_INTERVAL);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="flex justify-end items-center w-full">
  <div class="mx-auto text-2xl font-bold">Online</div>
  <div class="flex flex-nowrap">
    <div class="flex-initial grow-0">
      <RadioGroup display="flex" border="border-token border-surface-200-700-token" background="">
        <RadioItem
          active="variant-ghost-primary"
          hover="hover:variant-soft-primary"
          bind:group={view}
          name="view"
          value={"day"}
        >
          Day
        </RadioItem>
        <RadioItem
          active="variant-ghost-primary"
          hover="hover:variant-soft-primary"
          bind:group={view}
          name="view"
          value={"month"}
        >
          Month
        </RadioItem>
        <RadioItem
          active="variant-ghost-primary"
          hover="hover:variant-soft-primary"
          bind:group={view}
          name="view"
          value={"3months"}
        >
          3 Months
        </RadioItem>
        <RadioItem
          active="variant-ghost-primary"
          hover="hover:variant-soft-primary"
          bind:group={view}
          name="view"
          value={"year"}
        >
          Year
        </RadioItem>
      </RadioGroup>
    </div>
  </div>
</div>

{#if data}
  <TimeChart options={timeChartOptions} data={data} />
{/if}
