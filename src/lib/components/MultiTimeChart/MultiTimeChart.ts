import type { TimeChartOptionsPartial, TimeChartData } from '../TimeChart/TimeChart';
import type { FileDefinition } from '$lib/files/types';

/*
 * Max width that we want to account for is 1k pxs.
 */

export type ViewLabel = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type data2TimeChartFn = (data: any) => TimeChartData;

/**
 * Definition for the specific View of the MultiTimeChart.
 */

export type ViewDefinition = {
  name: string;
  generalOptions: TimeChartOptionsPartial;
  fileDefinition: FileDefinition;
  tickSize: number;

  timeFormatFn: (time: number) => string;
  getMinTimeFn: () => number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMaxValueFn: (entries: any) => number;
  data2TimeChartFn: data2TimeChartFn;
};

export type ViewMap = {
  [key: ViewLabel]: ViewDefinition;
};
