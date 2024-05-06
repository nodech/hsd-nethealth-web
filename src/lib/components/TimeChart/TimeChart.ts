import type { RecursivePartial } from '$lib/type-utils';
import { HOUR, MINUTE, formatTime } from '$lib/utils/time';

const HOURS_12 = 12 * HOUR;
const MINUTES_10 = 10 * MINUTE;

export type YAxisOptions = {
  show: boolean;
  label: string;
  ignoreZero: boolean;

  maxValue: number;
  maxValueLine: boolean;
  roundedSteps: boolean;

  style: {
    // line position
    marginTop: number;
    marginRight: number;

    // line distance
    lineDistance: number;

    // text style
    fontSize: number;
  }
};

export type TimeAxis = {
  min: number;
  max: number;

  tickSize: number;
  formatFn: (time: number) => string;

  style: {
    marginBottom: number;

    tickWidth: number;
    fontSize: number;
  }
};

export type TimeChartOptions = {
  style: {
    height: number;
  }
  YAxis: YAxisOptions;
  XAxis: TimeAxis;
};

export type TimeChartOptionsPartial = RecursivePartial<TimeChartOptions>;

export type TimeChartData = {
  [key: string]: {
    style?: {
      stroke?: string;
    };
    data: { [key: number]: number };
  };
};

export const DEFAULT_VALUES: TimeChartOptions = {
  style: {
    height: 250
  },
  YAxis: {
    show: true,
    label: 'Y-axis',
    ignoreZero: false,

    maxValue: 100,
    maxValueLine: false,
    roundedSteps: false,

    style: {
      marginTop: 10,
      marginRight: 30,

      lineDistance: 25,

      fontSize: 10
    }
  },
  XAxis: {
    min: Date.now() - HOURS_12,
    max: Date.now(),
    tickSize: MINUTES_10,
    formatFn: formatTime,

    style: {
      marginBottom: 10,

      tickWidth: 10,
      fontSize: 10,
    }
  }
};

export function timeChartOptions(
  options: RecursivePartial<TimeChartOptions> = {},
  defaults = DEFAULT_VALUES
): TimeChartOptions {
  const yaxis: YAxisOptions = {
    ...defaults.YAxis, ...options.YAxis,
    style: { ...defaults.YAxis.style, ...options.YAxis?.style }
  };

  const xaxis: TimeAxis = {
    ...defaults.XAxis, ...options.XAxis,
    style: { ...defaults.XAxis.style, ...options.XAxis?.style }
  };

  return {
    style: { ...defaults.style, ...options.style },
    YAxis: yaxis,
    XAxis: xaxis
  };
}

export type TimeLineOptions = {
  min: number;
  max: number;
  tickSize: number;
  tickWidth: number;

  rightOffset: number;
};

export type TimeBox = {
  x1: number;
  x2: number;
  width: number;
  time: number;
  index: number;
};


type ByIndexes = {
  [index: number]: {
    posx: number,
    posy: number,
    value: number,
    time: number,
    index: number
  };
};

/**
 * Indexes are from right to left
 */

export class TimeLine {
  min: number;
  max: number;
  tickSize: number;
  tickWidth: number;
  offsetRight: number;

  #width: number;

  constructor(options: TimeLineOptions) {
    this.min = options.min;
    this.max = options.max;
    this.tickSize = options.tickSize;
    this.tickWidth = options.tickWidth;

    this.offsetRight = options.rightOffset;
    this.#width = 0;
  }

  get diff(): number {
    return this.max - this.min;
  }

  get ticks(): number {
    return this.diff / this.tickSize;
  }

  get width() {
    if (!this.#width) {
      this.#width = this.ticks * this.tickWidth + this.offsetRight;
    }

    return this.#width;
  }

  getIndexByTime(time: number) {
    if (time > this.max) {
      time = this.max;
    }

    return Math.floor((this.max - time) / this.tickSize);
  }

  getBoxByTime(time: number) {
    const index = this.getIndexByTime(time);
    return this.getBoxAt(index);
  }

  getTimeAt(index: number) {
    return this.max - index * this.tickSize;
  }

  getBoxAt(index: number): TimeBox {
    const x1 = this.width - this.offsetRight - index * this.tickWidth;
    const x2 = x1 - this.tickWidth;
    const width = this.tickWidth;
    const time = this.getTimeAt(index);

    return { x1, x2, width, index, time };
  }

  getTickBoxes(): TimeBox[] {
    const boxes: TimeBox[] = [];

    for (let i = 0; i < this.ticks; i++) {
      boxes.push(this.getBoxAt(i));
    }

    return boxes;
  }

  getDataByIndexes(data: { [time: number]: number }, getY: (value: number) => number): ByIndexes {
    const sortedTimes = Object.keys(data).map(Number).sort((a, b) => b - a);

    const dedupIndexes = new Set();
    const byIndexes: ByIndexes = {};

    for (const time of sortedTimes) {
      const box = this.getBoxByTime(time);
      const {index} = box;

      if (dedupIndexes.has(index)) {
        continue;
      }

      dedupIndexes.add(index);

      const value = data[time];
      const posx = box.x1 - (box.width / 2);
      const posy = getY(value);

      byIndexes[index] = { posx, posy, value, time, index };
    }

    return byIndexes;
  }
}

export function getPathForData(data: ByIndexes): string {
  const path = Object.values(data)
    .map(({ posx, posy }) => `${posx},${posy}`)
    .join(' ');

  return `M ${path}`;
}
