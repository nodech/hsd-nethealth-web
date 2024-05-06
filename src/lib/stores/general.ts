import { writable } from 'svelte/store';

import type { NodesGeneral } from '$lib/files/nodes-general';
import type { DNSGeneral } from '$lib/files/dns-general';

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
