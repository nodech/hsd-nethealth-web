export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const HOUR_12 = 12 * HOUR;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY;
export const YEAR = 365 * DAY;

export function formatTime(time: number): string {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    timeStyle: 'short',
    hour12: false,
  };

  const intl = new Intl.DateTimeFormat(undefined, options);
  return intl.format(date);
}

export function formatDate(time: number, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(time);
  const intl = new Intl.DateTimeFormat(undefined, options);
  return intl.format(date);
}

export function formatDateTime(time: number): string {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const intl = new Intl.DateTimeFormat(undefined, options);
  return intl.format(date);
}

export function isStale(time: number): boolean {
  return time < (Date.now() - HOUR);
}
