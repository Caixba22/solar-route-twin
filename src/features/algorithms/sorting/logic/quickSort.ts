// Ruta:
// src/features/algorithms/sorting/logic/quickSort.ts

/**
 * quickSortGenerator
 *
 * Generador puro para Quick Sort.
 *
 * Responsabilidad:
 * - Ordenar el arreglo recibido usando Quick Sort.
 * - Emitir pasos visuales para que useSortingRunner pinte la escena.
 *
 * Importante:
 * - No usa React.
 * - No usa Zustand.
 * - No usa Three.js.
 * - Sí muta el arreglo recibido, porque el runner trabaja con una copia interna.
 *
 * Quick Sort:
 * - Elige un pivote.
 * - Particiona el arreglo en menores y mayores respecto al pivote.
 * - Coloca el pivote en su posición final.
 * - Repite el proceso recursivamente en las particiones izquierda y derecha.
 *
 * Convención visual:
 * - pivot     → pivote.
 * - boundary  → frontera de partición.
 * - comparing → elemento comparado contra el pivote.
 * - active    → intercambio físico de barras.
 * - sorted    → índice que ya quedó en posición final.
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";

/**
 * Intercambia dos valores dentro del arreglo.
 */
const swap = (values: number[], firstIndex: number, secondIndex: number) => {
  [values[firstIndex], values[secondIndex]] = [
    values[secondIndex],
    values[firstIndex],
  ];
};

/**
 * Particiona el rango usando el último elemento como pivote.
 *
 * Devuelve la posición final del pivote.
 */
function* partition(
  values: number[],
  lowIndex: number,
  highIndex: number,
): Generator<AlgoStep, number, unknown> {
  const pivotValue = values[highIndex];
  let boundaryIndex = lowIndex;

  /**
   * Marcamos el pivote actual con color propio.
   */
  yield {
    type: "pivot",
    activeIndices: [highIndex],
    pivotIndices: [highIndex],
    boundaryIndices: [boundaryIndex],
  };

  for (let scanIndex = lowIndex; scanIndex < highIndex; scanIndex++) {
    /**
     * Comparamos el elemento escaneado contra el pivote.
     *
     * El pivote se mantiene con su color especial,
     * mientras el scanIndex usa color de comparación.
     */
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

        /**
         * Mostramos el intercambio.
         */
        yield {
          type: "active",
          activeIndices: [boundaryIndex, scanIndex],
          pivotIndices: [highIndex],
          boundaryIndices: [boundaryIndex],
        };
      }

      boundaryIndex++;

      /**
       * Mostramos cómo avanza la frontera de partición.
       */
      yield {
        type: "boundary",
        activeIndices: [boundaryIndex],
        pivotIndices: [highIndex],
        boundaryIndices: [boundaryIndex],
      };
    }
  }

  /**
   * Colocamos el pivote en su posición final.
   */
  if (boundaryIndex !== highIndex) {
    swap(values, boundaryIndex, highIndex);

    yield {
      type: "active",
      activeIndices: [boundaryIndex, highIndex],
      pivotIndices: [boundaryIndex],
    };
  }

  /**
   * El pivote ya quedó definitivamente ordenado.
   */
  yield {
    type: "sorted",
    activeIndices: [boundaryIndex],
    sortedIndices: [boundaryIndex],
  };

  return boundaryIndex;
}

/**
 * Quick Sort recursivo por rangos.
 */
function* quickSortRange(
  values: number[],
  lowIndex: number,
  highIndex: number,
): Generator<AlgoStep, void, unknown> {
  if (lowIndex > highIndex) return;

  /**
   * Caso base:
   * si el rango tiene un solo elemento, ya está ordenado.
   */
  if (lowIndex === highIndex) {
    yield {
      type: "sorted",
      activeIndices: [lowIndex],
      sortedIndices: [lowIndex],
    };

    return;
  }

  const pivotFinalIndex = yield* partition(values, lowIndex, highIndex);

  /**
   * Ordena la partición izquierda.
   */
  yield* quickSortRange(values, lowIndex, pivotFinalIndex - 1);

  /**
   * Ordena la partición derecha.
   */
  yield* quickSortRange(values, pivotFinalIndex + 1, highIndex);
}

export function* quickSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  if (total === 0) return;

  yield* quickSortRange(values, 0, total - 1);

  /**
   * Al final, reforzamos visualmente que todo el arreglo quedó ordenado.
   */
  yield {
    type: "sorted",
    activeIndices: Array.from({ length: total }, (_, index) => index),
    sortedIndices: Array.from({ length: total }, (_, index) => index),
  };
}