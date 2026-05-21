// Ruta:
// src/features/algorithms/sorting/logic/heapSort.ts

/**
 * heapSortGenerator
 *
 * Generador puro para Heap Sort.
 *
 * Responsabilidad:
 * - Ordenar el arreglo recibido usando Heap Sort.
 * - Emitir pasos visuales para que useSortingRunner pinte la escena.
 *
 * Importante:
 * - No usa React.
 * - No usa Zustand.
 * - No usa Three.js.
 * - Sí muta el arreglo recibido, porque el runner trabaja con una copia interna.
 *
 * Heap Sort:
 * - Construye un max heap.
 * - Intercambia la raíz con el último elemento del heap.
 * - Reduce el tamaño del heap.
 * - Reorganiza el heap.
 * - Repite hasta ordenar todo el arreglo.
 *
 * Convención visual:
 * - critical  → raíz o nodo principal del heap.
 * - comparing → comparación padre/hijo.
 * - active    → intercambio físico de barras.
 * - boundary  → límite actual del heap.
 * - sorted    → elementos que ya salieron del heap y quedaron ordenados.
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
 * Reorganiza una parte del arreglo para conservar la propiedad de max heap.
 *
 * max heap:
 * - Cada padre debe ser mayor o igual que sus hijos.
 */
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

    /**
     * Marcamos el nodo raíz actual y el límite del heap.
     */
    yield {
      type: "critical",
      activeIndices: [currentRootIndex],
      boundaryIndices: [0, heapLastIndex],
    };

    /**
     * Compara contra el hijo izquierdo.
     */
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

    /**
     * Compara contra el hijo derecho.
     */
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

    /**
     * Si el mayor no es la raíz actual, se intercambia
     * y seguimos reorganizando hacia abajo.
     */
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

  /**
   * Fase 1:
   * Construir el max heap.
   *
   * Empezamos desde el último nodo padre hacia la raíz.
   */
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

  /**
   * Fase 2:
   * Extraer el máximo una y otra vez.
   *
   * El máximo siempre está en la raíz, índice 0.
   * Lo mandamos al final del heap y reducimos el heap.
   */
  for (let endIndex = total - 1; endIndex > 0; endIndex--) {
    /**
     * Marcamos la raíz y la posición donde quedará el máximo.
     */
    yield {
      type: "critical",
      activeIndices: [0, endIndex],
      boundaryIndices: [0, endIndex],
    };

    swap(values, 0, endIndex);

    /**
     * Intercambio de la raíz con el último elemento del heap.
     */
    yield {
      type: "active",
      activeIndices: [0, endIndex],
      boundaryIndices: [0, endIndex],
    };

    /**
     * El elemento en endIndex ya quedó ordenado.
     */
    yield {
      type: "sorted",
      activeIndices: [endIndex],
      sortedIndices: [endIndex],
    };

    /**
     * Reorganizamos el heap restante.
     *
     * El nuevo heap llega hasta endIndex - 1.
     */
    yield* heapify(values, 0, endIndex);
  }

  /**
   * El primer elemento restante también queda ordenado.
   */
  yield {
    type: "sorted",
    activeIndices: [0],
    sortedIndices: [0],
  };

  /**
   * Refuerzo visual final.
   */
  yield {
    type: "sorted",
    activeIndices: Array.from({ length: total }, (_, index) => index),
    sortedIndices: Array.from({ length: total }, (_, index) => index),
  };
}