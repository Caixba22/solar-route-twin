// src/features/algorithms/sorting/logic/selectionSort.ts

import type { AlgoStep } from "../../../../shared/types/runtime.types";

export function* selectionSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  for (let currentIndex = 0; currentIndex < total; currentIndex++) {
    let minIndex = currentIndex;

    yield {
      type: "critical",
      activeIndices: [currentIndex],
    };

    for (
      let scanIndex = currentIndex + 1;
      scanIndex < total;
      scanIndex++
    ) {
    
      yield {
        type: "comparing",
        activeIndices: [minIndex, scanIndex],
      };

      if (values[scanIndex] < values[minIndex]) {
        minIndex = scanIndex;

        yield {
          type: "critical",
          activeIndices: [minIndex],
        };
      }
    }

    if (minIndex !== currentIndex) {
      [values[currentIndex], values[minIndex]] = [
        values[minIndex],
        values[currentIndex],
      ];

      yield {
        type: "active",
        activeIndices: [currentIndex, minIndex],
      };
    }

    yield {
      type: "sorted",
      activeIndices: [currentIndex],
    };
  }
}