<script lang="ts">
  import { ProgressRadial } from '@skeletonlabs/skeleton';
  import { getLines } from '$lib/utils/charts';
  import { formatTime } from '$lib/utils/time';
  import { simpleTooltip } from '../Tooltip'
  import type { TimeChartOptionsPartial, TimeChartOptions, TimeChartData } from './TimeChart';
  import { DEFAULT_VALUES, timeChartOptions, TimeLine, getPathForData } from './TimeChart';

  export let options: TimeChartOptionsPartial = DEFAULT_VALUES;
  export let data: TimeChartData = {};
  export let loading = false;

  let fullOptions: TimeChartOptions = timeChartOptions(options);
  let height: TimeChartOptions['style']['height'];
  let YAxis: TimeChartOptions['YAxis'];
  let XAxis: TimeChartOptions['XAxis'];
  let formatTimeFn = formatTime;

  $: {
    fullOptions = timeChartOptions(options);
    height = fullOptions.style.height;
    YAxis = fullOptions.YAxis;
    XAxis = fullOptions.XAxis;
    formatTimeFn = XAxis.formatFn || formatTime;
  }

  // X Axis helper
  let timeLine: TimeLine;
  let width: TimeLine['width'];

  $: {
    timeLine = new TimeLine({
      min: XAxis.min,
      max: XAxis.max,
      tickSize: XAxis.tickSize,
      tickWidth: XAxis.style.tickWidth,
      rightOffset: YAxis.style.marginRight
    });

    width = timeLine.width;
  }

  let yLine: {
    x: number;
    y1: number;
    y2: number;
    height: number;
  };

  let yLineLabel: {
    X: number;
    Y: number;
    transform: string;
  };

  let yLinesDetails: ReturnType<typeof getLines>;
  let yScale: number;
  let yLines: { x: number; y: number; value: number }[];

  $: {
    yLine = {
      x: width - YAxis.style.marginRight,
      y1: YAxis.style.marginTop,
      y2: fullOptions.style.height - XAxis.style.marginBottom,
      height: fullOptions.style.height - YAxis.style.marginTop - XAxis.style.marginBottom,
    };

    yLineLabel = {
      X: width - 5,
      Y: yLine.y2 / 2,
      transform: ''
    };

    yLineLabel.transform = `rotate(90 ${yLineLabel.X} ${yLineLabel.Y})`;

    yLinesDetails = getLines({
      height: yLine.height,
      lineDistance: YAxis.style.lineDistance,
      maxValue: YAxis.maxValue,
      maxValueLine: YAxis.maxValueLine,
      roundedSteps: YAxis.roundedSteps,
    });

    yScale = yLinesDetails.scale;

    yLines = yLinesDetails.lines
      .filter(line => line.value !== 0 || !YAxis.ignoreZero)
      .map((line) => {
        return {
          y: yLine.y2 - line.cord,
          x: yLine.x,

          value: Math.round(line.value)
        };
      });
  }

  // setup X axis.
  let xLine: {
    y: number;
    x1: number;
    x2: number;
  };

  let xBoxes: ReturnType<TimeLine['getTickBoxes']>;

  $: {
    xLine = {
      y: height - XAxis.style.marginBottom,
      x1: width - YAxis.style.marginRight,
      x2: 0,
    };

    xBoxes = timeLine.getTickBoxes();
  }


  type finalEntries = {
    [name: string]: {
      stroke?: string;
      path: string;
      data: ReturnType<TimeLine['getDataByIndexes']>
    }
  }

  type IndexLookups = {
    [index: number]: {
      name: string;
      value: number;
      time: number;
    }[]
  };

  let dataEntries: finalEntries = {};
  let indexLookups: IndexLookups = {};

  $: {
    indexLookups = {};
    dataEntries = {};

    for (const [name, info] of Object.entries(data)) {
      const dataByIndexes = timeLine.getDataByIndexes(info.data, (value) => {
        return yLine.y2 - (value * yScale);
      });
      const path = getPathForData(dataByIndexes);

      dataEntries[name] = {
        stroke: info.style?.stroke,
        path: path,
        data: dataByIndexes
      };

      for (const data of Object.values(dataByIndexes)) {
        if (!indexLookups[data.index])
          indexLookups[data.index] = [];

        indexLookups[data.index].push({
          name: name,
          value: data.value,
          time: data.time
        });
      }
    }

    dataEntries = dataEntries;
    indexLookups = indexLookups;
  }

  const getInfoByIndex = (index: number) => {
    if (!indexLookups[index])
      return 'No data';

    const time  = timeLine.getTimeAt(index);
    const entries = indexLookups[index];

    let info = `<div>Time: ${formatTimeFn(time)}</div>`;

    for (const entry of entries) {
      info += `<div>${entry.name}: ${entry.value}</div>`
    }

    return info;
  };

  // setup tooltip
  let tooltipDiv: HTMLDivElement | null = null;
</script>

<div class="card" bind:this={tooltipDiv}></div>
<div class="container" style="height: {height}px">
  <div
    class:invisible={!loading}
    class="absolute -top-10 left-0 w-full h-full flex items-center justify-center"
  >
    <ProgressRadial meter="stroke-primary-500" track="stroke-primary-500/30" strokeLinecap="butt" />
  </div>
  <svg
    width="{width}px"
    height="{height}px"
    viewBox="0 0 {width} {height}"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <line class="stroke" x1="{yLine.x}" y1="{yLine.y1}" x2="{yLine.x}" y2="{yLine.y2}" />
      <text
        class="fill" font-size="{YAxis.style.fontSize}"
        x="{yLineLabel.X}" y="{yLineLabel.Y}" transform="{yLineLabel.transform}"
        text-anchor="end" dominant-baseline="middle"
      >
        {YAxis.label}
      </text>
      {#each yLines as line}
        <line class="stroke" x1="{yLine.x - 2}" y1="{line.y}" x2="{yLine.x + 2}" y2="{line.y}" />
        <text class="fill" x="{yLine.x + 6}" y="{line.y + 2}" font-size="{YAxis.style.fontSize}">{line.value}</text>
      {/each}
    </g>

    <g>
      <line class="stroke" x1="{xLine.x1}" y1="{xLine.y}" x2="{xLine.x2}" y2="{xLine.y}" />
      {#each xBoxes as box}
        {#if tooltipDiv}
          <rect
            class="time-box"
            class:pointer-events-none={loading}
            data-title={getInfoByIndex(box.index)}
            x="{box.x2}" y="{YAxis.style.marginTop}"
            width="{box.width}" height="{height - XAxis.style.marginBottom - YAxis.style.marginTop}"
            fill="gray"
            use:simpleTooltip={{tooltipDiv}}
          >
          </rect>
        {/if}

        {#if box.index % 3 === 0}
          <line class="stroke" x1="{box.x1}" y1="{xLine.y - 2}" x2="{box.x1}" y2="{xLine.y + 2}" />
          <text
            class="fill" font-size="{XAxis.style.fontSize}" text-anchor="start"
            x="{box.x1}" y="{xLine.y + 10}"
            transform="rotate(45 {box.x1} {xLine.y + 10})"
          >
            {formatTimeFn(box.time)}
          </text>
        {/if}
      {/each}
    </g>

    {#each Object.entries(dataEntries) as [, entry]}
      <path stroke="{entry.stroke || 'rgba(var(--theme-font-color-dark))'}" stroke-width="1" d="{entry.path}" fill="none" />
    {/each}
  </svg>
</div>

<style>
  .container {
    width: 100%; /* Responsive width */
    height: 250px; /* Fixed height */
    overflow: hidden; /* Crop the SVG when the container is smaller */
    position: relative; /* Position the SVG */
  }

  svg {
    position: absolute; /* Position the SVG */
    top: 0; /* Position the SVG */
    right: 0; /* Position the SVG */
  }

  .stroke {
    stroke: rgba(var(--theme-font-color-base));
    stroke-width: 1;
  }

  :global(.dark) .stroke {
    stroke: rgba(var(--theme-font-color-dark));
    stroke-width: 1;
  }

  .fill {
    fill: rgba(var(--theme-font-color-base));
  }

  :global(.dark) .fill {
    fill: rgba(var(--theme-font-color-dark));
  }

  .time-box {
    opacity: 0;
  }

  .time-box:hover {
    opacity: 0.2;
  }
</style>
