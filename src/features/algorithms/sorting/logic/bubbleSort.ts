import type { AlgoStep } from "../../../../shared/types/runtime.types";

export function* bubbleSortGenerator(
  array: number[],
): Generator<AlgoStep, void, unknown> {
  const n = array.length;
  let limit = n - 1; // Hasta dónde debemos comparar en cada pasada

  while (limit > 0) {
    let lastSwapIndex = 0;

    for (let j = 0; j < limit; j++) {
      yield {
        type: "comparing",
        activeIndices: [j, j + 1],
      };

      if (array[j] > array[j + 1]) {
        // Intercambio
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;

        lastSwapIndex = j; // Guardamos dónde ocurrió el último intercambio

        yield {
          type: "active",
          activeIndices: [j, j + 1],
        };
      }
    }

    // Para la visualización: marcamos como "sorted" todos los elementos
    // que quedaron por encima del último intercambio
    for (let k = limit; k > lastSwapIndex; k--) {
        yield {
            type: "sorted",
            activeIndices: [k],
        };
    }

    // El nuevo límite para el siguiente ciclo es el último intercambio
    limit = lastSwapIndex; 
  }

  // Al finalizar, aseguramos que todo el arreglo emita el estado "sorted"
  yield {
    type: "sorted",
    activeIndices: Array.from({ length: n }, (_, index) => index),
  };
}