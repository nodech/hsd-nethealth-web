<script lang="ts">
  import MultiTimeChart from '$lib/components/MultiTimeChart/MultiTimeChart.svelte';
  import type { ViewMap } from '$lib/components/MultiTimeChart/MultiTimeChart';
  import type { TimeChartOptionsPartial, TimeChartData } from '$lib/components/TimeChart/TimeChart';
  import { NodeEntry } from '$lib/entry';

  export let host: string;
  export let port: number;

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
    NODE_HISTORY_10M,
    NODE_HISTORY_HOUR,
    NODE_HISTORY_DAY
  } from '$lib/files/node';

  type DayDataFormat = {
    timestamp: number;
    data: {
      [ts: number]: ReturnType<typeof NodeEntry.prototype.toJSON>
    };
  };

  type DataFormat = {
    timestamp: number;
    data: {
      [ts: number]: {
        total: number;
        canSync: number;
        spv: number;
        pruned: number;
        compacted: number;
        version: {
          [version: string]: number
        }
      }
    }
  };

  const defaultOptions = (tickWidth: number = 10): TimeChartOptionsPartial => {
    return {
      style: {
        height: 300,
      },
      YAxis: {
        label: 'Status',
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


  const data2TimeChartDay = (data: DayDataFormat): TimeChartData => {
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
      const pentry = NodeEntry.fromJSON(entry);
      const tsn = Number(ts);

      outData.online.data[tsn] = pentry.isSuccessful() ? 1 : 0;

      if (pentry.isSuccessful() && pentry.result) {
        outData.spv.data[tsn] = pentry.result.hasBloom() ? 1 : 0;
        outData.full.data[tsn] = pentry.result.pruned ? 0 : 1;
        outData.fullTree.data[tsn] = pentry.result.treeCompacted ? 0 : 1;
      } else {
        outData.spv.data[tsn] = 0;
        outData.full.data[tsn] = 0;
        outData.fullTree.data[tsn] = 0;
      }
    }

    return outData;
  };

  const perc = (n: number, total: number): number => {
    return Math.round((n / total) * 100);
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
      const total = entry.total;
      const sync = entry.canSync;

      outData.online.data[tsn] = perc(entry.canSync, total);
      outData.spv.data[tsn] = perc(entry.spv, total);
      outData.full.data[tsn] = perc(sync - entry.pruned, total);
      outData.fullTree.data[tsn] = perc(sync - entry.compacted, total);
    }

    return outData;
  };

  let views: ViewMap;

  $: {
    views = {
      day: {
        name: 'Day',
        generalOptions: defaultOptions(10),
        tickSize: 10 * MINUTE,
        fileDefinition: NODE_HISTORY_10M,

        getMinTimeFn: () => Date.now() - 24 * HOUR,
        getMaxValueFn: () => 1,
        timeFormatFn: formatTime,
        data2TimeChartFn: data2TimeChartDay,
        fetchArgs: [host, String(port)]
      },
      week: {
        name: 'Week',
        generalOptions: defaultOptions(8.5),
        tickSize: 1 * HOUR,
        fileDefinition: NODE_HISTORY_HOUR,

        getMinTimeFn: () => Date.now() - WEEK,
        getMaxValueFn: () => 100,
        timeFormatFn: (value: number) => {
          return formatDate(value, {
            month: '2-digit',
            day: 'numeric',
            hour: 'numeric'
          });
        },
        data2TimeChartFn: data2TimeChart,
        fetchArgs: [host, String(port)]
      },
      month5: {
        name: '5 Months',
        generalOptions: defaultOptions(9.5),
        tickSize: 1 * DAY,
        fileDefinition: NODE_HISTORY_DAY,

        getMinTimeFn: () => Date.now() - MONTH * 5,
        getMaxValueFn: () => 100,
        timeFormatFn: (value: number) => {
          return formatDate(value, {
            month: '2-digit',
            day: 'numeric',
            year: 'numeric'
          });
        },
        data2TimeChartFn: data2TimeChart,
        fetchArgs: [host, String(port)]
      }
    }
  }
</script>

<MultiTimeChart title="Status" defaultView="day" views={views} />
