<!-- <script lang="ts"> -->
<!--   import MultiTimeChart from '$lib/components/MultiTimeChart/MultiTimeChart.svelte'; -->
<!--   import type { ViewMap } from '$lib/components/MultiTimeChart/MultiTimeChart'; -->
<!--   import type { TimeEntries } from '$lib/types'; -->
<!--   import type { TimeChartOptionsPartial } from '$lib/components/TimeChart/TimeChart'; -->

<!--   import { -->
<!--     HOUR, -->
<!--     MINUTE, -->
<!--     formatTime -->
<!--   } from '$lib/utils/time'; -->

<!--   import { -->
<!--     DNS_DAY_10m, -->
<!--   } from '$lib/files/dns-general'; -->

<!--   const defaultOptions = (tickWidth: number = 10): TimeChartOptionsPartial => { -->
<!--     return { -->
<!--       style: { -->
<!--         height: 300, -->
<!--       }, -->
<!--       YAxis: { -->
<!--         label: 'Online', -->
<!--         style: { -->
<!--           marginRight: 40, -->
<!--           fontSize: 11 -->
<!--         } -->
<!--       }, -->
<!--       XAxis: { -->
<!--         style: { -->
<!--           marginBottom: 60, -->
<!--           tickWidth: tickWidth -->
<!--         } -->
<!--       } -->
<!--     }; -->
<!--   }; -->

<!--   const maxValue = (entries: TimeEntries) => { -->
<!--     let max = 0; -->

<!--     for (const value of Object.values(entries.data)) { -->
<!--       if (value > max) { -->
<!--         max = value; -->
<!--       } -->
<!--     } -->

<!--     return max; -->
<!--   }; -->

<!--   const views: ViewMap = { -->
<!--     day: { -->
<!--       name: 'Day', -->
<!--       generalOptions: defaultOptions(10), -->
<!--       tickSize: 10 * MINUTE, -->
<!--       fileDefinition: DNS_DAY_10m, -->

<!--       getMinTimeFn: () => Date.now() - 24 * HOUR, -->
<!--       getMaxValueFn: maxValue, -->
<!--       timeFormatFn: formatTime -->
<!--     } -->
<!--   }; -->
<!-- </script> -->

<!-- [> <div class="min-h-14 flex items-center justify-center text-2xl font-bold">Active Nodes Graph</div> <] -->
<!-- <MultiTimeChart title="Active Nodes Graph" defaultView="day" views={views} /> -->
