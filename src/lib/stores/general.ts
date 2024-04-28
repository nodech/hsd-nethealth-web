import { writable } from 'svelte/store';

import type { DNSGeneral, NodesGeneral } from '$lib/files';

function createNodesStore() {
  const { subscribe, set, update } = writable({
    loading: true,
    general: null as (NodesGeneral | null),
  });

  return {
    subscribe,
    set,
    update,
  };
}

function createDNSStore() {
  const { subscribe, set, update } = writable({
    loading: true,
    general: null as (DNSGeneral | null),
  });

  return {
    subscribe,
    set,
    update,
  };
}

export const nodes = createNodesStore();
export const dns = createDNSStore();
