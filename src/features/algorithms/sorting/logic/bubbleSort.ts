import type { AlgoStep } from "../../../../shared/types/runtime.types";

export function* bubbleSortGenerator(
  array: number[],
): Generator<AlgoStep, void, unknown> {
  const n = array.length;
  let limit = n - 1;

  while (limit > 0) {
    let lastSwapIndex = 0;

    for (let j = 0; j < limit; j++) {
      yield {
        type: "comparing",
        activeIndices: [j, j + 1],
      };

      if (array[j] > array[j + 1]) {
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;

        lastSwapIndex = j; 

        yield {
          type: "active",
          activeIndices: [j, j + 1],
        };
      }
    }


    for (let k = limit; k > lastSwapIndex; k--) {
        yield {
            type: "sorted",
            activeIndices: [k],
        };
    }

    limit = lastSwapIndex; 
  }

  yield {
    type: "sorted",
    activeIndices: Array.from({ length: n }, (_, index) => index),
  };
}