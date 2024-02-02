
export function percent(num: number, total: number): string {
  return ((num / total) * 100).toFixed(2) + '%';
}
