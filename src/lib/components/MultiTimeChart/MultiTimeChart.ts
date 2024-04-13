import type { TimeChartOptionsPartial } from "../TimeChart/TimeChart";
import type {
  TimeEntries,
  FileDefinition
} from "$lib/files";

/*
 * Max width that we want to account for is 1k pxs.
 */

export type ViewLabel = string;

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
  getMaxValueFn: (entries: TimeEntries) => number;
};

export type ViewMap = {
  [key: ViewLabel]: ViewDefinition;
};
