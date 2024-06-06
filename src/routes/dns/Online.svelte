<script lang="ts">
  import MultiTimeChart from '$lib/components/MultiTimeChart/MultiTimeChart.svelte';
  import type { ViewMap } from '$lib/components/MultiTimeChart/MultiTimeChart';
  import type { TimeEntries } from '$lib/types';
  import type { TimeChartOptionsPartial, TimeChartData } from '$lib/components/TimeChart/TimeChart';

  import {
    MONTH,
    DAY,
    HOUR,
    MINUTE,
    WEEK,
    formatDate,
    formatTime
  } from '$lib/utils/time';

  import {
    DNS_DAY_10M,
    DNS_WEEK_HOUR,
    DNS_5MONTHS_DAY
  } from '$lib/files/dns-general';

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

  const views: ViewMap = {
    day: {
      name: 'Day',
      generalOptions: defaultOptions(10),
      tickSize: 10 * MINUTE,
      fileDefinition: DNS_DAY_10M,

      getMinTimeFn: () => Date.now() - 24 * HOUR,
      timeFormatFn: formatTime,
      data2TimeChartFn: data2TimeChart
    },
    week: {
      name: 'Week',
      generalOptions: defaultOptions(8.5),
      tickSize: 1 * HOUR,
      fileDefinition: DNS_WEEK_HOUR,

      getMinTimeFn: () => Date.now() - WEEK,
      timeFormatFn: (value: number) => {
        return formatDate(value, {
          month: '2-digit',
          day: 'numeric',
          hour: 'numeric'
        });
      },
      data2TimeChartFn: data2TimeChart
    },
    months5: {
      name: '5 Months',
      generalOptions: defaultOptions(9.5),
      tickSize: 1 * DAY,
      fileDefinition: DNS_5MONTHS_DAY,

      getMinTimeFn: () => Date.now() - 5 * MONTH,
      timeFormatFn: (value: number) => {
        return formatDate(value, {
          month: '2-digit',
          day: 'numeric',
          year: 'numeric'
        });
      },
      data2TimeChartFn: data2TimeChart
    }
  };
</script>

<MultiTimeChart title="Online" defaultView="day" views={views} />
