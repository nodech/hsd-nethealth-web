
export function bucketNumber(num: number, segments: number, max: number): number {
  const bsize = max / segments;
  return (num % segments) * bsize + Math.floor(num / segments);
}

export type SemVersion = {
  major: number;
  minor: number;
  patch: number;
};
