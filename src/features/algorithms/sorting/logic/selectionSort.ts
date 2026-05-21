// Ruta:
// src/features/algorithms/sorting/logic/selectionSort.ts

/**
 * selectionSortGenerator
 *
 * Generador puro para Selection Sort.
 *
 * Responsabilidad:
 * - Ordenar el arreglo recibido usando Selection Sort.
 * - Emitir pasos visuales para que useSortingRunner pinte la escena.
 *
 * Importante:
 * - No usa React.
 * - No usa Zustand.
 * - No usa Three.js.
 * - Sí muta el arreglo recibido, igual que Bubble Sort,
 *   porque el runner trabaja con una copia interna del arreglo.
 *
 * Selection Sort:
 * - Recorre el arreglo posición por posición.
 * - Busca el menor elemento restante.
 * - Lo intercambia con la posición actual.
 * - Marca esa posición como ordenada.
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";

export function* selectionSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  for (let currentIndex = 0; currentIndex < total; currentIndex++) {
    let minIndex = currentIndex;

    /**
     * Marca la posición actual.
     *
     * Esta posición será donde se colocará el menor elemento encontrado.
     */
    yield {
      type: "critical",
      activeIndices: [currentIndex],
    };

    /**
     * Busca el menor elemento desde currentIndex + 1 hasta el final.
     */
    for (
      let scanIndex = currentIndex + 1;
      scanIndex < total;
      scanIndex++
    ) {
      /**
       * Compara el mínimo actual contra el elemento escaneado.
       */
      yield {
        type: "comparing",
        activeIndices: [minIndex, scanIndex],
      };

      if (values[scanIndex] < values[minIndex]) {
        minIndex = scanIndex;

        /**
         * Marca visualmente el nuevo mínimo encontrado.
         */
        yield {
          type: "critical",
          activeIndices: [minIndex],
        };
      }
    }

    /**
     * Si el menor elemento no está en la posición actual,
     * se intercambia.
     */
    if (minIndex !== currentIndex) {
      [values[currentIndex], values[minIndex]] = [
        values[minIndex],
        values[currentIndex],
      ];

      /**
       * active indica al runner que debe actualizar matrices,
       * porque las barras cambiaron de posición/altura.
       */
      yield {
        type: "active",
        activeIndices: [currentIndex, minIndex],
      };
    }

    /**
     * La posición currentIndex ya quedó ordenada.
     */
    yield {
      type: "sorted",
      activeIndices: [currentIndex],
    };
  }
}