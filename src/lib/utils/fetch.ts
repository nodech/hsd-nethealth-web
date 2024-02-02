import type { FileDefinition } from '$lib/files';

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchFile(file: FileDefinition, id?: string) {
  await sleep(2000);
  return fetch(file.FILE(id));
}

export async function fetchData(url: string) {
  await sleep(2000);
  return fetch(url);
}
