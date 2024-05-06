import type { FileDefinition } from '$lib/files/types';

export type DNSGeneral = {
  timestamp: number,
  up: number,
  total: number,
}

export const DNS_GENERAL: FileDefinition = {
  ID: 'app:dns-general',
  FILE: () => './data/dns/general.json',
  REFETCH_INTERVAL: 1000 * 60 * 10
};

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

export const DNS_STATUS_BY_HOST: FileDefinition = {
  ID: 'app:dns-status-by-host',
  FILE: (hostname?: string) => `./data/dns/stats-info/${hostname}.json`,
  REFETCH_INTERVAL: 1000 * 60 * 10
};
