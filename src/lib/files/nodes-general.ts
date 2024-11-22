import type {
  UpCounts,
  NodesGeneralStatusList
} from '$lib/types';

import type { FileDefinition } from '$lib/files/types';


export type NodesGeneral = {
  timestamp: number,
  upCounts: UpCounts,
  version: 'string',
  mainSeeds: {
    total: number,
    up: number,
    statuses: NodesGeneralStatusList
  },
  generatedSeeds: {
    total: number,
    up: number,
    statuses: NodesGeneralStatusList
  }
}

export const NODES_GENERAL: FileDefinition = {
  ID: 'app:seednodes',
  FILE: () => './data/nodes/general.json',
  REFETCH_INTERVAL: 1000 * 60 * 10, // 10 minutes
  // REFETCH_INTERVAL: 1000 * 60 * 5, // 5 minutes
  // REFETCH_INTERVAL: 1000 * 10 * 1, // 10 seconds
};

export const NODES_ACTIVE_10M: FileDefinition = {
  ID: 'app:seednodes-active-10m',
  FILE: () => './data/nodes/active-10m-day.json',
  REFETCH_INTERVAL: 1000 * 60 * 10,
};

export const NODES_ACTIVE_HOUR: FileDefinition = {
  ID: 'app:seednodes-active-hour',
  FILE: () => './data/nodes/active-hour-week.json',
  REFETCH_INTERVAL: 1000 * 60 * 10,
};

export const NODES_ACTIVE_DAY: FileDefinition = {
  ID: 'app:seednodes-active-day',
  FILE: () => './data/nodes/active-day-5month.json',
  REFETCH_INTERVAL: 1000 * 60 * 10,
};

export const NODES_ONLINE: FileDefinition = {
  ID: 'app:online-nodes',
  FILE: () => './data/nodes/online-now.json',
  REFETCH_INTERVAL: 1000 * 60 * 10,
  // REFETCH_INTERVAL: 1000 * 60 * 1,
};
