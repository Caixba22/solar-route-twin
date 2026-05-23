// src/features/algorithms/sorting/logic/insertionSort.ts

import type { AlgoStep } from "../../../../shared/types/runtime.types";

export function* insertionSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  if (total === 0) return;

  yield {
    type: "sorted",
    activeIndices: [0],
  };

  for (let currentIndex = 1; currentIndex < total; currentIndex++) {
    const valueToInsert = values[currentIndex];
    let scanIndex = currentIndex - 1;

    yield {
      type: "critical",
      activeIndices: [currentIndex],
    };

    while (scanIndex >= 0 && values[scanIndex] > valueToInsert) {
      yield {
        type: "comparing",
        activeIndices: [scanIndex, scanIndex + 1],
      };

      values[scanIndex + 1] = values[scanIndex];

      yield {
        type: "active",
        activeIndices: [scanIndex, scanIndex + 1],
      };

      scanIndex--;
    }

    values[scanIndex + 1] = valueToInsert;

    yield {
      type: "active",
      activeIndices: [scanIndex + 1],
    };

    yield {
      type: "sorted",
      activeIndices: Array.from(
        { length: currentIndex + 1 },
        (_, index) => index,
      ),
    };
  }
}