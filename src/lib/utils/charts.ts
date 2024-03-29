
export type GetLinesOptions = {
  height: number;
  lineDistance: number;

  roundedSteps?: boolean;
  roundedValues?: boolean;

  maxValue: number;
  maxValueLine?: boolean;
};

export type LinesResult = {
  scale: number;
  stepSize: number;

  lines: Lines;
};

export type Lines = Array<{
  value: number;
  cord: number;
}>;

export function getLines(options: GetLinesOptions): LinesResult {
  let lineCount = Math.floor(options.height / options.lineDistance);
  lineCount = Math.min(lineCount, options.maxValue);

  const scale = options.height / options.maxValue;
  const rawStepSize = options.maxValue / lineCount;
  const stepSize = options.roundedSteps ? Math.floor(rawStepSize) : rawStepSize;

  const lines: Lines = [];

  for (let i = 0; i <= lineCount; i++) {
    const value = i * stepSize;
    const cord = value * scale;

    lines.push({
      value,
      cord
    });
  }

  const lastValue = lines[lines.length - 1]?.value;

  if (lastValue && options.maxValueLine && lastValue < options.maxValue) {
    lines.push({
      value: options.maxValue,
      cord: options.height
    });
  }

  return {
    scale,
    stepSize,
    lines
  };
}
