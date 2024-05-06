export type FilePath = ((input?: string) => string);

export type FileDefinition = {
  ID: `${string}:${string}`,
  FILE: FilePath,
  REFETCH_INTERVAL: number
}
