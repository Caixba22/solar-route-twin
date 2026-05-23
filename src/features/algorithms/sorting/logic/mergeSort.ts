// src/features/algorithms/sorting/logic/mergeSort.ts

import type { AlgoStep } from "../../../../shared/types/runtime.types";

function* mergeRanges(
  values: number[],
  startIndex: number,
  middleIndex: number,
  endIndex: number,
): Generator<AlgoStep, void, unknown> {
  const leftValues = values.slice(startIndex, middleIndex + 1);
  const rightValues = values.slice(middleIndex + 1, endIndex + 1);

  let leftIndex = 0;
  let rightIndex = 0;
  let writeIndex = startIndex;

  yield {
    type: "boundary",
    activeIndices: [startIndex, middleIndex, endIndex],
    boundaryIndices: [startIndex, middleIndex, endIndex],
  };

  while (leftIndex < leftValues.length && rightIndex < rightValues.length) {
    const leftVisualIndex = startIndex + leftIndex;
    const rightVisualIndex = middleIndex + 1 + rightIndex;

    yield {
      type: "comparing",
      activeIndices: [leftVisualIndex, rightVisualIndex],
      comparingIndices: [leftVisualIndex, rightVisualIndex],
      boundaryIndices: [startIndex, middleIndex, endIndex],
    };

    if (leftValues[leftIndex] <= rightValues[rightIndex]) {
      values[writeIndex] = leftValues[leftIndex];
      leftIndex++;
    } else {
      values[writeIndex] = rightValues[rightIndex];
      rightIndex++;
    }

    yield {
      type: "active",
      activeIndices: [writeIndex],
      boundaryIndices: [startIndex, middleIndex, endIndex],
    };

    writeIndex++;
  }

  while (leftIndex < leftValues.length) {
    values[writeIndex] = leftValues[leftIndex];

    yield {
      type: "active",
      activeIndices: [writeIndex],
      boundaryIndices: [startIndex, middleIndex, endIndex],
    };

    leftIndex++;
    writeIndex++;
  }

  while (rightIndex < rightValues.length) {
    values[writeIndex] = rightValues[rightIndex];

    yield {
      type: "active",
      activeIndices: [writeIndex],
      boundaryIndices: [startIndex, middleIndex, endIndex],
    };

    rightIndex++;
    writeIndex++;
  }
}

function* mergeSortRange(
  values: number[],
  startIndex: number,
  endIndex: number,
): Generator<AlgoStep, void, unknown> {
  if (startIndex >= endIndex) return;

  const middleIndex = Math.floor((startIndex + endIndex) / 2);

  yield {
    type: "boundary",
    activeIndices: [startIndex, middleIndex, endIndex],
    boundaryIndices: [startIndex, middleIndex, endIndex],
  };

  yield* mergeSortRange(values, startIndex, middleIndex);
  yield* mergeSortRange(values, middleIndex + 1, endIndex);
  yield* mergeRanges(values, startIndex, middleIndex, endIndex);
}

export function* mergeSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  if (total === 0) return;

  yield* mergeSortRange(values, 0, total - 1);

  yield {
    type: "sorted",
    activeIndices: Array.from({ length: total }, (_, index) => index),
    sortedIndices: Array.from({ length: total }, (_, index) => index),
  };
}