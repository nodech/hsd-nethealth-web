<script lang="ts">
  import MultiTimeChart from "$lib/components/MultiTimeChart/MultiTimeChart.svelte";
  import type { ViewMap } from "$lib/components/MultiTimeChart/MultiTimeChart";
  import type { TimeEntries } from "$lib/files";
  import type { TimeChartOptionsPartial } from "$lib/components/TimeChart/TimeChart";

  import {
    MONTH,
    DAY,
    HOUR,
    MINUTE,
    formatDate,
    formatTime
  } from "$lib/utils/time";

  import {
    DNS_DAY_10m,
    DNS_WEEK_HOUR,
    DNS_5MONTHS_DAY
  } from '$lib/files';

  const defaultOptions = (tickWidth: number = 10): TimeChartOptionsPartial => {
    return {
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
          tickWidth: tickWidth
        }
      }
    };
  };

  const maxValue = (entries: TimeEntries) => {
    let max = 0;

    for (const value of Object.values(entries.data)) {
      if (value > max) {
        max = value;
      }
    }

    return max;
  };

  const views: ViewMap = {
    day: {
      name: 'Day',
      generalOptions: defaultOptions(10),
      tickSize: 10 * MINUTE,
      fileDefinition: DNS_DAY_10m,

      getMinTimeFn: () => Date.now() - 24 * HOUR,
      getMaxValueFn: maxValue,
      timeFormatFn: formatTime
    },
    week: {
      name: 'Week',
      generalOptions: defaultOptions(8.5),
      tickSize: 1 * HOUR,
      fileDefinition: DNS_WEEK_HOUR,

      getMinTimeFn: () => Date.now() - MONTH,
      getMaxValueFn: maxValue,
      timeFormatFn: (value: number) => {
        return formatDate(value, {
          month: '2-digit',
          day: 'numeric',
          hour: 'numeric'
        });
      }
    },
    months5: {
      name: '5 Months',
      generalOptions: defaultOptions(9.5),
      tickSize: 1 * DAY,
      fileDefinition: DNS_5MONTHS_DAY,

      getMinTimeFn: () => Date.now() - 5 * MONTH,
      getMaxValueFn: maxValue,
      timeFormatFn: (value: number) => {
        return formatDate(value, {
          month: '2-digit',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }
  };
</script>

<MultiTimeChart title="Online" defaultView="day" views={views} />
