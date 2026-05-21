// Ruta:
// src/features/algorithms/sorting/logic/countingSort.ts

/**
 * countingSortGenerator
 *
 * Generador puro para Counting Sort.
 *
 * Responsabilidad:
 * - Ordenar el arreglo recibido usando conteo de frecuencias.
 * - Emitir pasos visuales para que useSortingRunner pinte la escena.
 *
 * Importante:
 * - No usa React.
 * - No usa Zustand.
 * - No usa Three.js.
 * - Sí muta el arreglo recibido, porque el runner trabaja con una copia interna.
 *
 * Counting Sort:
 * - No compara elementos entre sí.
 * - Cuenta cuántas veces aparece cada valor.
 * - Reconstruye el arreglo de menor a mayor.
 *
 * Convención visual:
 * - comparing → barra que se está leyendo para contar.
 * - critical  → valor/rango importante durante el conteo.
 * - active    → escritura del valor ordenado en el arreglo.
 * - boundary  → posición donde se está escribiendo.
 * - sorted    → posición que ya quedó reconstruida.
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";

/**
 * Busca el índice de la primera aparición de un valor.
 *
 * Se usa solo para dar una referencia visual cuando estamos
 * recorriendo los valores posibles del conteo.
 */
const findFirstIndexOfValue = (values: number[], targetValue: number) => {
  return values.findIndex((value) => value === targetValue);
};

export function* countingSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  if (total === 0) return;

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const rangeSize = maxValue - minValue + 1;

  const counts = Array.from({ length: rangeSize }, () => 0);

  /**
   * Fase 1:
   * Contar cuántas veces aparece cada valor.
   *
   * En esta visualización, cada barra se marca mientras se lee.
   */
  for (let readIndex = 0; readIndex < total; readIndex++) {
    const value = values[readIndex];
    const countIndex = value - minValue;

    counts[countIndex]++;

    yield {
      type: "comparing",
      activeIndices: [readIndex],
      comparingIndices: [readIndex],
      boundaryIndices: [0, total - 1],
    };
  }

  /**
   * Fase 2:
   * Recorrer los valores posibles de menor a mayor.
   *
   * Como no tenemos buckets visuales todavía, marcamos una barra
   * que represente el valor actual cuando exista en el arreglo.
   */
  let writeIndex = 0;

  for (let countIndex = 0; countIndex < counts.length; countIndex++) {
    const currentValue = countIndex + minValue;
    const referenceIndex = findFirstIndexOfValue(values, currentValue);

    if (referenceIndex >= 0) {
      yield {
        type: "critical",
        activeIndices: [referenceIndex],
        boundaryIndices: [writeIndex],
      };
    }

    /**
     * Escribimos el valor actual tantas veces como indique su conteo.
     */
    while (counts[countIndex] > 0) {
      values[writeIndex] = currentValue;

      /**
       * active indica que cambió físicamente la barra en writeIndex.
       */
      yield {
        type: "active",
        activeIndices: [writeIndex],
        boundaryIndices: [writeIndex],
      };

      /**
       * La posición writeIndex ya quedó reconstruida en orden.
       */
      yield {
        type: "sorted",
        activeIndices: [writeIndex],
        sortedIndices: [writeIndex],
      };

      writeIndex++;
      counts[countIndex]--;
    }
  }

  /**
   * Refuerzo visual final.
   */
  yield {
    type: "sorted",
    activeIndices: Array.from({ length: total }, (_, index) => index),
    sortedIndices: Array.from({ length: total }, (_, index) => index),
  };
}