// Ruta:
// src/features/algorithms/sorting/logic/insertionSort.ts

/**
 * insertionSortGenerator
 *
 * Generador puro para Insertion Sort.
 *
 * Responsabilidad:
 * - Ordenar el arreglo recibido usando Insertion Sort.
 * - Emitir pasos visuales para que useSortingRunner pinte la escena.
 *
 * Importante:
 * - No usa React.
 * - No usa Zustand.
 * - No usa Three.js.
 * - Sí muta el arreglo recibido, porque el runner trabaja con una copia interna.
 *
 * Insertion Sort:
 * - Toma un elemento desde la parte no ordenada.
 * - Lo compara hacia la izquierda.
 * - Desplaza los elementos mayores.
 * - Inserta el valor en su posición correcta.
 * - Mantiene una zona izquierda ordenada.
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";

export function* insertionSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  if (total === 0) return;

  /**
   * El primer elemento se considera ordenado inicialmente.
   */
  yield {
    type: "sorted",
    activeIndices: [0],
  };

  for (let currentIndex = 1; currentIndex < total; currentIndex++) {
    const valueToInsert = values[currentIndex];
    let scanIndex = currentIndex - 1;

    /**
     * Marca el elemento que se intentará insertar
     * dentro de la zona ordenada.
     */
    yield {
      type: "critical",
      activeIndices: [currentIndex],
    };

    /**
     * Compara hacia la izquierda mientras los elementos sean mayores
     * que el valor que queremos insertar.
     */
    while (scanIndex >= 0 && values[scanIndex] > valueToInsert) {
      yield {
        type: "comparing",
        activeIndices: [scanIndex, scanIndex + 1],
      };

      /**
       * Desplaza el elemento mayor una posición a la derecha.
       */
      values[scanIndex + 1] = values[scanIndex];

      /**
       * active indica al runner que debe actualizar las matrices,
       * porque visualmente cambió la distribución de las barras.
       */
      yield {
        type: "active",
        activeIndices: [scanIndex, scanIndex + 1],
      };

      scanIndex--;
    }

    /**
     * Inserta el valor en la posición correcta.
     */
    values[scanIndex + 1] = valueToInsert;

    yield {
      type: "active",
      activeIndices: [scanIndex + 1],
    };

    /**
     * Después de cada pasada, la zona izquierda desde 0 hasta currentIndex
     * queda ordenada.
     */
    yield {
      type: "sorted",
      activeIndices: Array.from(
        { length: currentIndex + 1 },
        (_, index) => index,
      ),
    };
  }
}