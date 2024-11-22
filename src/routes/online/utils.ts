import type { Filters } from './types';
import type { BoolFilterState } from './types';

import {
  BoolFilterAll,
  BoolFilterExclude,
  BoolFilterInclude
} from './types';

export const defaultFilters: Filters = {
  sync: BoolFilterAll,
  spv: BoolFilterAll,
  fullnode: BoolFilterAll,
  tree: BoolFilterAll,

  generated: BoolFilterAll,
  main: BoolFilterAll,
  brontide: BoolFilterAll
};

export function getFilters(uhash: string): Filters {
  const hashFilters = parseHash(uhash);

  if (!hashFilters)
    return {...defaultFilters};

  return {
    ...defaultFilters,
    ...hashFilters
  };
}

export function parseHash(uhash: string): Filters | null {
  try {
    const hash = uhash.slice(1);

    if (!hash)
      return null;

    const decoded = atob(hash);
    const json = JSON.parse(decoded);
    return json;
  } catch (e) {
    return null;
  }
}

export function setHash(filters: Filters): void {
  const json = JSON.stringify(filters);
  const base64 = btoa(json);
  window.location.hash = base64;
}

export function filterCheck(state: BoolFilterState, value: boolean) {
  if (state === BoolFilterExclude)
    return value === false;

  if (state === BoolFilterInclude)
    return value === true;

  return true;
}
