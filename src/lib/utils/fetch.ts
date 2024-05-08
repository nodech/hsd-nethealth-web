import type { FileDefinition } from '$lib/files/types';

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchJSON(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { signal });
  return response.json();
}

export async function fetchFile(file: FileDefinition, signal?: AbortSignal, ...args: string[]) {
  return fetchJSON(file.FILE(...args), signal);
}

export async function fetchData(url: string, signal?: AbortSignal) {
  return fetchJSON(url, signal);
}
