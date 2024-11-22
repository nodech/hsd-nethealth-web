import type { NodeEntry } from '$lib/entry';

export const BoolFilterAll = -1;
export const BoolFilterInclude = 1;
export const BoolFilterExclude = 0;

export type BoolFilterState = typeof BoolFilterAll |
  typeof BoolFilterInclude |
  typeof BoolFilterExclude;

export type OnlineInfo = {
  host: string;
  port: string;
  entry: NodeEntry;
  mainSeed: boolean;
  generatedSeed: boolean;
}

export type Filters = {
  sync: BoolFilterState;
  spv: BoolFilterState;
  fullnode: BoolFilterState;
  tree: BoolFilterState;

  generated: BoolFilterState;
  main: BoolFilterState;

  brontide: BoolFilterState;
};

// export type sorts = {
// };
