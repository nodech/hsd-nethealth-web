<script lang="ts">
  import MultiTimeChart from '$lib/components/MultiTimeChart/MultiTimeChart.svelte';
  import type { ViewMap } from '$lib/components/MultiTimeChart/MultiTimeChart';
  import type { UpCounts } from '$lib/types';
  import type { TimeChartOptionsPartial, TimeChartData } from '$lib/components/TimeChart/TimeChart';

  import {
    MINUTE,
    HOUR,
    DAY,
    WEEK,
    MONTH,
    formatTime,
    formatDate
  } from '$lib/utils/time';

  import {
    NODES_ACTIVE_10M,
    NODES_ACTIVE_HOUR,
    NODES_ACTIVE_DAY
  } from '$lib/files/nodes-general';

  const defaultOptions = (tickWidth: number = 10): TimeChartOptionsPartial => {
    return {
      style: {
        height: 300,
      },
      YAxis: {
        label: 'Online Nodes',
        style: {
          marginRight: 40,
          fontSize: 11
        }
      },
      XAxis: {
        style: {
          marginBottom: 60,
          tickWidth: tickWidth
        }
      }
    };
  };

  const maxValue = (data: DataFormat) => {
    let max = 0;

    for (const entry of Object.values(data.data)) {
      if (entry.total > max) {
        max = entry.total;
      }
    }

    return max;
  };

  type DataFormat = {
    timestamp: number;
    data: {
      [ts: number]: UpCounts
    }
  };

  const data2TimeChart = (data: DataFormat): TimeChartData => {
    const outData: TimeChartData = {
      online: {
        style: {
          stroke: '#33a02c'
        },
        data: {}
      },
      full: {
        style: {
          stroke: '#1f78b4'
        },
        data: {}
      },
      spv: {
        style: {
          stroke: '#a6cee3'
        },
        data: {}
      },
      fullTree: {
        style: {
          stroke: '#b2df8a'
        },
        data: {}
      },
    };

    for (const [ts, entry] of Object.entries(data.data)) {
      const tsn = Number(ts);
      outData.online.data[tsn] = entry.total;
      outData.spv.data[tsn] = entry.spv;
      outData.full.data[tsn] = entry.total - entry.pruned;
      outData.fullTree.data[tsn] = entry.total - entry.compacted;
    }

    return outData;
  };

  const views: ViewMap = {
    day: {
      name: 'Day',
      generalOptions: defaultOptions(10),
      tickSize: 10 * MINUTE,
      fileDefinition: NODES_ACTIVE_10M,

      getMinTimeFn: () => Date.now() - 24 * HOUR,
      getMaxValueFn: maxValue,
      timeFormatFn: formatTime,
      data2TimeChartFn: data2TimeChart,
    },
    week: {
      name: 'Week',
      generalOptions: defaultOptions(8.5),
      tickSize: 1 * HOUR,
      fileDefinition: NODES_ACTIVE_HOUR,

      getMinTimeFn: () => Date.now() - WEEK,
      getMaxValueFn: maxValue,
      timeFormatFn: (value: number) => {
        return formatDate(value, {
          month: '2-digit',
          day: 'numeric',
          hour: 'numeric'
        });
      },
      data2TimeChartFn: data2TimeChart,
    },
    month5: {
      name: '5 Months',
      generalOptions: defaultOptions(9.5),
      tickSize: 1 * DAY,
      fileDefinition: NODES_ACTIVE_DAY,

      getMinTimeFn: () => Date.now() - MONTH * 5,
      getMaxValueFn: maxValue,
      timeFormatFn: (value: number) => {
        return formatDate(value, {
          month: '2-digit',
          day: 'numeric',
          year: 'numeric'
        });
      },
      data2TimeChartFn: data2TimeChart,
    }
  };
</script>

<!-- <div class="min-h-14 flex items-center justify-center text-2xl font-bold">Active Nodes Graph</div> -->
<MultiTimeChart title="Active" defaultView="day" views={views} />
