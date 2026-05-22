// Ruta:
// src/features/dataStructures/linearMemory/logic/arrayOperations.ts

/**
 * arrayOperations
 *
 * Lógica pura para operaciones sobre arrays.
 *
 * Importante:
 * - No usa React.
 * - No usa Three.js.
 * - No usa Zustand.
 * - Solo emite pasos visuales.
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";
import type { LinearMemoryOperationConfig } from "../types/linearMemory.types";

/**
 * Devuelve los extremos del array para marcarlos visualmente.
 *
 * boundary significa frontera o límite.
 * En un array nos sirve para mostrar:
 * - primera posición
 * - última posición
 */
const getArrayBoundaries = (values: number[]): number[] => {
  if (values.length === 0) return [];
  if (values.length === 1) return [0];

  return [0, values.length - 1];
};

/**
 * Crea una lista de índices desde 0 hasta endExclusive - 1.
 *
 * Ejemplo:
 * createIndexRange(3) => [0, 1, 2]
 */
const createIndexRange = (endExclusive: number): number[] => {
  return Array.from({ length: endExclusive }, (_, index) => index);
};

/**
 * Limita un índice para que siempre esté dentro del array.
 */
const clampIndex = (index: number, total: number): number => {
  if (total <= 0) return 0;

  return Math.max(0, Math.min(index, total - 1));
};

/**
 * Operación 1:
 * Recorrido del array de izquierda a derecha.
 *
 * Visualmente:
 * - activeIndices marca la celda actual.
 * - sortedIndices marca las celdas ya visitadas.
 * - boundaryIndices marca los extremos del array.
 */
function* arrayTraversalGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const boundaryIndices = getArrayBoundaries(values);

  for (let index = 0; index < values.length; index++) {
    yield {
      type: "active",
      activeIndices: [index],
      boundaryIndices,
      sortedIndices: createIndexRange(index),
      result: "visiting",
      currentLabel: "CURRENT",
      description: `Visitando el índice ${index}. Valor actual: ${values[index]}.`,
    };
  }

  yield {
    type: "sorted",
    activeIndices: [],
    boundaryIndices,
    sortedIndices: createIndexRange(values.length),
    result: "finished",
    description: `Recorrido terminado. Se visitaron ${values.length} celdas del array.`,
  };
}

/**
 * Operación 2:
 * Búsqueda lineal de un valor.
 *
 * Visualmente:
 * - comparing marca la celda que se está comparando.
 * - sorted marca el valor encontrado.
 * - critical marca que no se encontró el valor.
 */
function* arraySearchGenerator(
  values: number[],
  target: number,
): Generator<AlgoStep, void, unknown> {
  const boundaryIndices = getArrayBoundaries(values);
  const visitedIndices: number[] = [];

  for (let index = 0; index < values.length; index++) {
    yield {
      type: "comparing",
      activeIndices: [index],
      comparingIndices: [index],
      boundaryIndices,
      sortedIndices: [...visitedIndices],
      result: "comparing",
      currentLabel: "CURRENT",
      description: `Comparando índice ${index}: ${values[index]} === ${target}.`,
    };

    if (values[index] === target) {
      yield {
        type: "sorted",
        activeIndices: [index],
        boundaryIndices,
        sortedIndices: [...visitedIndices, index],
        result: "found",
        currentLabel: "FOUND",
        description: `Valor encontrado. ${target} está en el índice ${index}.`,
      };

      return;
    }

    visitedIndices.push(index);
  }

  /**
   * Si no se encontró el valor, marcamos todas las celdas
   * como critical para indicar que el objetivo no existe.
   */
  yield {
    type: "critical",
    activeIndices: createIndexRange(values.length),
    boundaryIndices,
    result: "not-found",
    description: `El valor ${target} no se encontró dentro del array.`,
  };
}

/**
 * Operación 3:
 * Acceso directo por índice.
 *
 * A diferencia de search, no recorre celda por celda.
 * Va directo a la posición solicitada.
 */
function* arrayAccessGenerator(
  values: number[],
  requestedIndex: number,
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) return;

  const boundaryIndices = getArrayBoundaries(values);
  const safeIndex = clampIndex(requestedIndex, values.length);

  yield {
    type: "boundary",
    activeIndices: [safeIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "INDEX",
    description: `Validando el índice solicitado. El rango permitido es 0 a ${
      values.length - 1
    }.`,
  };

  yield {
    type: "active",
    activeIndices: [safeIndex],
    boundaryIndices,
    result: "accessed",
    currentLabel: "ACCESS",
    description: `Acceso directo: índice ${safeIndex}, valor ${values[safeIndex]}.`,
  };
}

/**
 * Crea el generador correcto según la operación seleccionada.
 *
 * Este es el punto único donde Array decide qué operación ejecutar.
 */
export const createArrayOperationGenerator = (
  values: number[],
  config: LinearMemoryOperationConfig,
): Generator<AlgoStep, void, unknown> => {
  if (config.operationId === "search") {
    return arraySearchGenerator(values, config.searchTarget);
  }

  if (config.operationId === "access") {
    return arrayAccessGenerator(values, config.accessIndex);
  }

  return arrayTraversalGenerator(values);
};