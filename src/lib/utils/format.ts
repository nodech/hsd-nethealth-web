export function percent(num: number, total: number): string {
  return ((num / total) * 100).toFixed(2) + '%';
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat().format(num);
}


