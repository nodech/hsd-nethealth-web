export type FilePath = ((...args: string[]) => string);

export type FileDefinition = {
  ID: `${string}:${string}`,
  FILE: FilePath,
  REFETCH_INTERVAL: number
}
