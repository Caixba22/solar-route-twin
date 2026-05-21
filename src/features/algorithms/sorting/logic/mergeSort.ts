// Ruta:
// src/features/algorithms/sorting/logic/mergeSort.ts

/**
 * mergeSortGenerator
 *
 * Generador puro para Merge Sort.
 *
 * Responsabilidad:
 * - Ordenar el arreglo recibido usando Merge Sort.
 * - Emitir pasos visuales para que useSortingRunner pinte la escena.
 *
 * Importante:
 * - No usa React.
 * - No usa Zustand.
 * - No usa Three.js.
 * - Sí muta el arreglo recibido, porque el runner trabaja con una copia interna.
 *
 * Merge Sort:
 * - Divide el arreglo en mitades.
 * - Ordena recursivamente cada mitad.
 * - Fusiona ambas mitades en orden.
 *
 * Convención visual:
 * - boundary  → límites del rango que se está fusionando.
 * - comparing → comparación entre elementos de izquierda y derecha.
 * - active    → escritura/movimiento de valor dentro del arreglo.
 * - sorted    → arreglo final ordenado.
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";

/**
 * Fusiona dos rangos ordenados:
 *
 * Izquierda:
 * [startIndex ... middleIndex]
 *
 * Derecha:
 * [middleIndex + 1 ... endIndex]
 */
function* mergeRanges(
  values: number[],
  startIndex: number,
  middleIndex: number,
  endIndex: number,
): Generator<AlgoStep, void, unknown> {
  const leftValues = values.slice(startIndex, middleIndex + 1);
  const rightValues = values.slice(middleIndex + 1, endIndex + 1);

  let leftIndex = 0;
  let rightIndex = 0;
  let writeIndex = startIndex;

  /**
   * Marcamos visualmente el rango que se va a fusionar.
   *
   * boundaryIndices:
   * - inicio del rango
   * - mitad
   * - final del rango
   */
  yield {
    type: "boundary",
    activeIndices: [startIndex, middleIndex, endIndex],
    boundaryIndices: [startIndex, middleIndex, endIndex],
  };

  while (leftIndex < leftValues.length && rightIndex < rightValues.length) {
    const leftVisualIndex = startIndex + leftIndex;
    const rightVisualIndex = middleIndex + 1 + rightIndex;

    /**
     * Comparamos el elemento actual de la mitad izquierda
     * contra el elemento actual de la mitad derecha.
     */
    yield {
      type: "comparing",
      activeIndices: [leftVisualIndex, rightVisualIndex],
      comparingIndices: [leftVisualIndex, rightVisualIndex],
      boundaryIndices: [startIndex, middleIndex, endIndex],
    };

    if (leftValues[leftIndex] <= rightValues[rightIndex]) {
      values[writeIndex] = leftValues[leftIndex];
      leftIndex++;
    } else {
      values[writeIndex] = rightValues[rightIndex];
      rightIndex++;
    }

    /**
     * active indica al runner que debe actualizar matrices,
     * porque el arreglo cambió físicamente en writeIndex.
     */
    yield {
      type: "active",
      activeIndices: [writeIndex],
      boundaryIndices: [startIndex, middleIndex, endIndex],
    };

    writeIndex++;
  }

  /**
   * Copia los elementos restantes de la mitad izquierda.
   */
  while (leftIndex < leftValues.length) {
    values[writeIndex] = leftValues[leftIndex];

    yield {
      type: "active",
      activeIndices: [writeIndex],
      boundaryIndices: [startIndex, middleIndex, endIndex],
    };

    leftIndex++;
    writeIndex++;
  }

  /**
   * Copia los elementos restantes de la mitad derecha.
   */
  while (rightIndex < rightValues.length) {
    values[writeIndex] = rightValues[rightIndex];

    yield {
      type: "active",
      activeIndices: [writeIndex],
      boundaryIndices: [startIndex, middleIndex, endIndex],
    };

    rightIndex++;
    writeIndex++;
  }
}

/**
 * Divide recursivamente el arreglo y después fusiona.
 */
function* mergeSortRange(
  values: number[],
  startIndex: number,
  endIndex: number,
): Generator<AlgoStep, void, unknown> {
  if (startIndex >= endIndex) return;

  const middleIndex = Math.floor((startIndex + endIndex) / 2);

  /**
   * Marcamos el rango actual que se está dividiendo.
   */
  yield {
    type: "boundary",
    activeIndices: [startIndex, middleIndex, endIndex],
    boundaryIndices: [startIndex, middleIndex, endIndex],
  };

  yield* mergeSortRange(values, startIndex, middleIndex);
  yield* mergeSortRange(values, middleIndex + 1, endIndex);
  yield* mergeRanges(values, startIndex, middleIndex, endIndex);
}

export function* mergeSortGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const total = values.length;

  if (total === 0) return;

  yield* mergeSortRange(values, 0, total - 1);

  /**
   * Al final, todo el arreglo queda ordenado.
   */
  yield {
    type: "sorted",
    activeIndices: Array.from({ length: total }, (_, index) => index),
    sortedIndices: Array.from({ length: total }, (_, index) => index),
  };
}