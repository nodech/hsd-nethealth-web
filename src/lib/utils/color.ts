import type { SemVersion } from './generic';
import { bucketNumber } from './generic';

const MAX_VERSION = 31;

// Numbers to exclude red and green.
const GREEN_MIN = 70;
const GREEN_MAX = 160;
const GREEN_DIFF = GREEN_MAX - GREEN_MIN;
const RED_START = 20;
const RED_CUTOFF = 340;

// number of colors left.
const TOTAL_HUE = 360 - GREEN_DIFF - RED_START - (360 - RED_CUTOFF);

export type HSL = {
  hue: number;
  saturation: number;
  lightness: number;
}

export function getDirectVersionColor(version: SemVersion, isWhite: boolean): HSL {
  let hue: number = 0;
  let saturation: number = 0;
  let lightness: number = 0;

  const remappedMajor = bucketNumber(version.major, 5, MAX_VERSION);
  hue = bucketNumber(remappedMajor, MAX_VERSION, TOTAL_HUE);

  // get rid off starting red.
  hue += RED_START;

  // get rid of green.
  if (hue > GREEN_MIN) {
    hue += GREEN_DIFF;
  }

  saturation = 60;

  if (version.minor >= 0) {
    saturation += version.minor * 10;
  } else {
    saturation = 100;
  }

  lightness = 50;

  if (version.patch >= 0) {
    lightness += Math.min(version.patch * 5, 20);
  }

  if (isWhite) {
    lightness -= 10;
  }

  return { hue, saturation, lightness };
}

export function getVersionColor(version: SemVersion, isWhite: boolean = true): HSL {
  return getDirectVersionColor({
    ...version,
  }, isWhite);
}

export function getCSSFromHSL(hsl: HSL): string {
  return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;
}

export function generatePieChartColors(numColors: number): HSL[] {
    const colors = [];
    const saturation = 60; // Balanced saturation
    const lightness = 50; // Neutral lightness

    for (let i = 0; i < numColors; i++) {
        const hue = (i * 360) / numColors;
        colors.push({hue, saturation, lightness});
    }

    return colors;
}
