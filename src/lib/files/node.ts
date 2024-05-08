import type { FileDefinition } from '$lib/files/types';

export const NODE: FileDefinition = {
  ID: 'app:node-status',
  FILE: (hostname?: string) => `./data/nodes/hosts/${hostname}/general.json`,
  REFETCH_INTERVAL: 1000 * 60 * 10, // 10 minutes
  // REFETCH_INTERVAL: 1000 * 60 * 5, // 5 minutes
  // REFETCH_INTERVAL: 1000 * 10, // 10 seconds
};

export const NODE_HISTORY_10M: FileDefinition = {
  ID: 'app:node-history-10m',
  FILE: (hostname: string, port: string) => `./data/nodes/hosts/${hostname}/${port}-history-10m-day.json`,
  REFETCH_INTERVAL: 1000 * 60 * 10,
};

export const NODE_HISTORY_HOUR: FileDefinition = {
  ID: 'app:node-history-hour',
  FILE: (hostname: string, port: string) => `./data/nodes/hosts/${hostname}/${port}-history-hour-week.json`,
  REFETCH_INTERVAL: 1000 * 60 * 10,
};

export const NODE_HISTORY_DAY: FileDefinition = {
  ID: 'app:node-history-day',
  FILE: (hostname: string, port: string) => `./data/nodes/hosts/${hostname}/${port}-history-day-5month.json`,
  REFETCH_INTERVAL: 1000 * 60 * 10,
};
