// src/features/algorithms/sorting/logic/countingSort.ts


import type { AlgoStep } from "../../../../shared/types/runtime.types";

const findFirstIndexOfValue = (values: number[], targetValue: number) => {
  return values.findIndex((value) => value === targetValue);
};

export function* countingSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  if (total === 0) return;

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const rangeSize = maxValue - minValue + 1;

  const counts = Array.from({ length: rangeSize }, () => 0);

 
  for (let readIndex = 0; readIndex < total; readIndex++) {
    const value = values[readIndex];
    const countIndex = value - minValue;

    counts[countIndex]++;

    yield {
      type: "comparing",
      activeIndices: [readIndex],
      comparingIndices: [readIndex],
      boundaryIndices: [0, total - 1],
    };
  }

  let writeIndex = 0;

  for (let countIndex = 0; countIndex < counts.length; countIndex++) {
    const currentValue = countIndex + minValue;
    const referenceIndex = findFirstIndexOfValue(values, currentValue);

    if (referenceIndex >= 0) {
      yield {
        type: "critical",
        activeIndices: [referenceIndex],
        boundaryIndices: [writeIndex],
      };
    }

    while (counts[countIndex] > 0) {
      values[writeIndex] = currentValue;

      yield {
        type: "active",
        activeIndices: [writeIndex],
        boundaryIndices: [writeIndex],
      };

      yield {
        type: "sorted",
        activeIndices: [writeIndex],
        sortedIndices: [writeIndex],
      };

      writeIndex++;
      counts[countIndex]--;
    }
  }

 
  yield {
    type: "sorted",
    activeIndices: Array.from({ length: total }, (_, index) => index),
    sortedIndices: Array.from({ length: total }, (_, index) => index),
  };
}