import type { NodesGeneralStatuses } from '$lib/types';

export type NodeGeneralStatuses = {
  [port: number]: NodesGeneralStatuses;
};
