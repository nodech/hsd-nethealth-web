import type { GeneralStatuses } from '$lib/files';
import {
  GENERAL_STATUSES
} from '$lib/files';

export const ssr = false;
export const prerender = true;
export const trailingSlash = "never";

export async function load({ fetch, depends }) {
  let generalStatuses: GeneralStatuses | null = null;

  try {
    depends(GENERAL_STATUSES.ID);
    const response = await fetch(GENERAL_STATUSES.FILE);
    generalStatuses = await response.json() as GeneralStatuses;
  } catch (e) {
    console.error(e);
  }

  return { generalStatuses };
}
