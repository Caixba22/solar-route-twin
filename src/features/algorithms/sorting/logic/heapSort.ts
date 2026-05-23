// src/features/algorithms/sorting/logic/heapSort.ts

import type { AlgoStep } from "../../../../shared/types/runtime.types";

const swap = (values: number[], firstIndex: number, secondIndex: number) => {
  [values[firstIndex], values[secondIndex]] = [
    values[secondIndex],
    values[firstIndex],
  ];
};

function* heapify(
  values: number[],
  rootIndex: number,
  heapSize: number,
): Generator<AlgoStep, void, unknown> {
  let currentRootIndex = rootIndex;

  while (true) {
    let largestIndex = currentRootIndex;

    const leftChildIndex = currentRootIndex * 2 + 1;
    const rightChildIndex = currentRootIndex * 2 + 2;
    const heapLastIndex = heapSize - 1;

    yield {
      type: "critical",
      activeIndices: [currentRootIndex],
      boundaryIndices: [0, heapLastIndex],
    };

    if (leftChildIndex < heapSize) {
      yield {
        type: "comparing",
        activeIndices: [largestIndex, leftChildIndex],
        comparingIndices: [largestIndex, leftChildIndex],
        boundaryIndices: [0, heapLastIndex],
      };

      if (values[leftChildIndex] > values[largestIndex]) {
        largestIndex = leftChildIndex;

        yield {
          type: "critical",
          activeIndices: [largestIndex],
          boundaryIndices: [0, heapLastIndex],
        };
      }
    }

  
    if (rightChildIndex < heapSize) {
      yield {
        type: "comparing",
        activeIndices: [largestIndex, rightChildIndex],
        comparingIndices: [largestIndex, rightChildIndex],
        boundaryIndices: [0, heapLastIndex],
      };

      if (values[rightChildIndex] > values[largestIndex]) {
        largestIndex = rightChildIndex;

        yield {
          type: "critical",
          activeIndices: [largestIndex],
          boundaryIndices: [0, heapLastIndex],
        };
      }
    }

   
    if (largestIndex !== currentRootIndex) {
      swap(values, currentRootIndex, largestIndex);

      yield {
        type: "active",
        activeIndices: [currentRootIndex, largestIndex],
        boundaryIndices: [0, heapLastIndex],
      };

      currentRootIndex = largestIndex;
      continue;
    }

    break;
  }
}

export function* heapSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  if (total === 0) return;

  for (
    let startIndex = Math.floor(total / 2) - 1;
    startIndex >= 0;
    startIndex--
  ) {
    yield {
      type: "critical",
      activeIndices: [startIndex],
      boundaryIndices: [0, total - 1],
    };

    yield* heapify(values, startIndex, total);
  }

 
  for (let endIndex = total - 1; endIndex > 0; endIndex--) {
    
    yield {
      type: "critical",
      activeIndices: [0, endIndex],
      boundaryIndices: [0, endIndex],
    };

    swap(values, 0, endIndex);

    
    yield {
      type: "active",
      activeIndices: [0, endIndex],
      boundaryIndices: [0, endIndex],
    };

   
    yield {
      type: "sorted",
      activeIndices: [endIndex],
      sortedIndices: [endIndex],
    };

   
    yield* heapify(values, 0, endIndex);
  }

  
  yield {
    type: "sorted",
    activeIndices: [0],
    sortedIndices: [0],
  };

  yield {
    type: "sorted",
    activeIndices: Array.from({ length: total }, (_, index) => index),
    sortedIndices: Array.from({ length: total }, (_, index) => index),
  };
}