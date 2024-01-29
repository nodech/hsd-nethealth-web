
export type GeneralStatuses = {
  timestamp: number,
  reachable: number,
  dnsSeeds: {
    [key: string]: boolean
  },
  nodes: {
    [key: string]: boolean
  }
}

export type FileDefinition = {
  ID: `${string}:${string}`,
  FILE: string,
  REFETCH_INTERVAL: number
}

export const GENERAL_STATUSES: FileDefinition = {
  ID: 'app:seednodes',
  FILE: './data/general-statuses.json',
  // REFETCH_INTERVAL: 1000 * 60 * 5, // 5 minutes
  REFETCH_INTERVAL: 1000 * 10, // 10 seconds
};

export const MAIN_PAGE: FileDefinition = {
  ID: 'app:mainpage',
  FILE: './data/main.json',
  // REFETCH_INTERVAL: 1000 * 60 * 5, // 5 minutes
  REFETCH_INTERVAL: 1000 * 10, // 10 seconds
};
