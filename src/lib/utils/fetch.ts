import type { FileDefinition } from '$lib/files/types';

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchJSON(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { signal });
  return response.json();
}

export async function fetchFile(file: FileDefinition, id?: string, signal?: AbortSignal) {
  return fetchJSON(file.FILE(id), signal);
}

export async function fetchData(url: string, signal?: AbortSignal) {
  return fetchJSON(url, signal);
}
