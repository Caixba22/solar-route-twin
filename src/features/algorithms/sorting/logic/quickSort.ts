// src/features/algorithms/sorting/logic/quickSort.ts

import type { AlgoStep } from "../../../../shared/types/runtime.types";

const swap = (values: number[], firstIndex: number, secondIndex: number) => {
  [values[firstIndex], values[secondIndex]] = [
    values[secondIndex],
    values[firstIndex],
  ];
};

function* partition(
  values: number[],
  lowIndex: number,
  highIndex: number,
): Generator<AlgoStep, number, unknown> {
  const pivotValue = values[highIndex];
  let boundaryIndex = lowIndex;

  yield {
    type: "pivot",
    activeIndices: [highIndex],
    pivotIndices: [highIndex],
    boundaryIndices: [boundaryIndex],
  };

  for (let scanIndex = lowIndex; scanIndex < highIndex; scanIndex++) {
  
    yield {
      type: "comparing",
      activeIndices: [scanIndex],
      comparingIndices: [scanIndex],
      pivotIndices: [highIndex],
      boundaryIndices: [boundaryIndex],
    };

    if (values[scanIndex] < pivotValue) {
      if (boundaryIndex !== scanIndex) {
        swap(values, boundaryIndex, scanIndex);

        yield {
          type: "active",
          activeIndices: [boundaryIndex, scanIndex],
          pivotIndices: [highIndex],
          boundaryIndices: [boundaryIndex],
        };
      }

      boundaryIndex++;

      yield {
        type: "boundary",
        activeIndices: [boundaryIndex],
        pivotIndices: [highIndex],
        boundaryIndices: [boundaryIndex],
      };
    }
  }

  if (boundaryIndex !== highIndex) {
    swap(values, boundaryIndex, highIndex);

    yield {
      type: "active",
      activeIndices: [boundaryIndex, highIndex],
      pivotIndices: [boundaryIndex],
    };
  }

  yield {
    type: "sorted",
    activeIndices: [boundaryIndex],
    sortedIndices: [boundaryIndex],
  };

  return boundaryIndex;
}


function* quickSortRange(
  values: number[],
  lowIndex: number,
  highIndex: number,
): Generator<AlgoStep, void, unknown> {
  if (lowIndex > highIndex) return;

 
  if (lowIndex === highIndex) {
    yield {
      type: "sorted",
      activeIndices: [lowIndex],
      sortedIndices: [lowIndex],
    };

    return;
  }

  const pivotFinalIndex = yield* partition(values, lowIndex, highIndex);

  
  yield* quickSortRange(values, lowIndex, pivotFinalIndex - 1);

  yield* quickSortRange(values, pivotFinalIndex + 1, highIndex);
}

export function* quickSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  if (total === 0) return;

  yield* quickSortRange(values, 0, total - 1);

  yield {
    type: "sorted",
    activeIndices: Array.from({ length: total }, (_, index) => index),
    sortedIndices: Array.from({ length: total }, (_, index) => index),
  };
}