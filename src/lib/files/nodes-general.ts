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
  // REFETCH_INTERVAL: 1000 * 10, // 10 seconds
};
