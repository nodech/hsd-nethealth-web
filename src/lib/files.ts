type FilePath = ((input?: string) => string);

export type FileDefinition = {
  ID: `${string}:${string}`,
  FILE: FilePath,
  REFETCH_INTERVAL: number
}

export type NodesGeneral = {
  timestamp: number,
  reachable: number,
  up: number,
  total: number,
}

export const NODES_GENERAL: FileDefinition = {
  ID: 'app:seednodes',
  FILE: () => './data/nodes/general.json',
  // REFETCH_INTERVAL: 1000 * 60 * 5, // 5 minutes
  // REFETCH_INTERVAL: 1000 * 10, // 10 seconds
  REFETCH_INTERVAL: 0
};

export type DNSGeneral = {
  timestamp: number,
  up: number,
  total: number,
}

export const DNS_GENERAL: FileDefinition = {
  ID: 'app:dns-general',
  FILE: () => './data/dns/general.json',
  REFETCH_INTERVAL: 1000 * 60 * 10
  // REFETCH_INTERVAL: 1000 * 10, // 10 seconds
  // REFETCH_INTERVAL: 0
};

export type TimeEntries = {
  timestamp: number,
  data: {
    [key: number]: number
  }
};

export type DNSDay = TimeEntries;
export type DNSMonth = TimeEntries;
export type DNS3Months = TimeEntries;
export type DNSYear = TimeEntries;

export const DNS_DAY_10m: FileDefinition = {
  ID: 'app:dns-day-10m',
  FILE: () => './data/dns/up-day-10m.json',
  REFETCH_INTERVAL: 1000 * 60 * 10
};

export const DNS_WEEK_HOUR: FileDefinition = {
  ID: 'app:dns-week-hour',
  FILE: () => './data/dns/up-week-hour.json',
  REFETCH_INTERVAL: 1000 * 60 * 10
};

export const DNS_5MONTHS_DAY: FileDefinition = {
  ID: 'app:dns-5months-day',
  FILE: () => './data/dns/up-5months-day.json',
  REFETCH_INTERVAL: 1000 * 60 * 10
};

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

export const DNS_STATUS_BY_HOST: FileDefinition = {
  ID: 'app:dns-status-by-host',
  FILE: (hostname?: string) => `./data/dns/stats-info/${hostname}.json`,
  REFETCH_INTERVAL: 1000 * 60 * 10
};
