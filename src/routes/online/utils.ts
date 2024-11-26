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

export function getFilters(params: URLSearchParams): Filters {
  const parsedFilters = getFiltersUrl(params);

  if (!parsedFilters)
    return {...defaultFilters};

  const final =  {
    ...defaultFilters,
    ...parsedFilters
  };

  return final;
}

export function getFiltersUrl(params: URLSearchParams): Partial<Filters> {
  const result: Partial<Filters> = {};

  parseBoolCheck(result, params, 'sync');
  parseBoolCheck(result, params, 'spv');
  parseBoolCheck(result, params, 'fullnode');
  parseBoolCheck(result, params, 'tree');

  parseBoolCheck(result, params, 'generated');
  parseBoolCheck(result, params, 'main');
  parseBoolCheck(result, params, 'brontide');

  return result;
}

export function getFiltersSearchParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value === BoolFilterAll || typeof value === 'undefined')
      continue;

    console.log(key, value);
    params.set(key, value.toString());
  }

  return params;
}

export function filterCheck(state: BoolFilterState, value: boolean) {
  if (state === BoolFilterExclude)
    return value === false;

  if (state === BoolFilterInclude)
    return value === true;

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseBoolCheck(obj: any, params: URLSearchParams, name: string): BoolFilterState | undefined {
  const value = params.get(name);

  if (!value)
    return;

  if (value === '0') {
    obj[name] = BoolFilterExclude;
    return;
  }

  if (value === '1') {
    obj[name] = BoolFilterInclude;
  }

  if (value === '-1') {
    obj[name] = BoolFilterAll;
  }
}
