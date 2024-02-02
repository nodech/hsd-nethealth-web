type FilePath = ((input?: string) => string);

export type FileDefinition = {
  ID: `${string}:${string}`,
  FILE: FilePath,
  REFETCH_INTERVAL: number
}

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

export const GENERAL_STATUSES: FileDefinition = {
  ID: 'app:seednodes',
  FILE: () => './data/general-statuses.json',
  // REFETCH_INTERVAL: 1000 * 60 * 5, // 5 minutes
  REFETCH_INTERVAL: 1000 * 10, // 10 seconds
};

export type MainPage = {
  timestamp: number,
  reachable: number,
  lastMessage: number,
  totalLogged: number,
  SPV: number,
  pruned: number,
  treeCompacted: number,
  countries: {
    [key: string]: number
  },
  versions: {
    [key: string]: number
  },

};

export const MAIN_PAGE: FileDefinition = {
  ID: 'app:mainpage',
  FILE: () => './data/main.json',
  // REFETCH_INTERVAL: 1000 * 60 * 5, // 5 minutes
  REFETCH_INTERVAL: 1000 * 30, // 10 seconds
};

export const IP_PAGE: FileDefinition = {
  ID: 'app:ip',
  FILE: (hostname?: string) => `./data/nodes/${hostname}.json`,
  // REFETCH_INTERVAL: 1000 * 60 * 5, // 5 minutes
  REFETCH_INTERVAL: 1000 * 30, // 10 seconds
};
