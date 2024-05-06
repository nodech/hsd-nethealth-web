import type { NodeEntry } from '$lib/entry';

// DNS types
export type DNSStatus = {
  timestamp: number,
  lastUp: number,
  lastStatus: {
    info: {
      time: number,
      hostname: string,
      error: string | null,
      result: string | null
    }
  }
};

// Nodes types
export type UpCounts = {
  total: number,
  spv: number,
  compacted: number,
  pruned: number,
  canSync: number,
  version: { [key: string]: number }
};

export type NodesGeneralStatuses = {
  isUp: boolean,
  lastUp: ReturnType<typeof NodeEntry.prototype.toJSON> | null,
  lastStatus: ReturnType<typeof NodeEntry.prototype.toJSON>
};

export type NodesGeneralStatusList = {
  [host: string]: {
    [port: string]: NodesGeneralStatuses
  }
};

// Generic types
export type TimeEntries = {
  timestamp: number,
  data: {
    [key: number]: number
  }
};
