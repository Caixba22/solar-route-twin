// Ruta:
// src/features/dataStructures/linearMemory/types/linearMemory.types.ts

/**
 * Tipos internos para visualizaciones de memoria lineal.
 *
 * Importante:
 * - Estos tipos NO pertenecen al catálogo global.
 * - El catálogo solo dice qué estructura existe: Array.
 * - Aquí definimos qué operaciones internas puede ejecutar esa estructura.
 */

import type { AlgoStepResult } from "../../../../shared/types/runtime.types";

export const ARRAY_OPERATION_IDS = [
  "traverse",
  "search",
  "access",
] as const;

/**
 * Operaciones visuales disponibles para Array.
 *
 * traverse:
 * - Recorre el array de izquierda a derecha.
 *
 * search:
 * - Busca un valor comparando celda por celda.
 *
 * access:
 * - Accede directamente a una posición por índice.
 */
export type ArrayOperationId = (typeof ARRAY_OPERATION_IDS)[number];

export type LinearMemoryOperationConfig = {
  operationId: ArrayOperationId;
  searchTarget: number;
  accessIndex: number;
};

/**
 * Snapshot ligero para mostrar información textual en la UI.
 *
 * No guarda datos pesados.
 * No guarda objetos 3D.
 * Solo resume el paso visual actual.
 */
export type LinearMemoryRuntimeSnapshot = {
  operationLabel: string;
  statusLabel: string;
  description: string;
  activeIndex?: number;
  activeValue?: number;
  targetValue?: number;
  accessIndex?: number;
  result?: AlgoStepResult;
};

/**
 * Valida si un string pertenece a las operaciones disponibles del array.
 */
export const isArrayOperationId = (
  value: string,
): value is ArrayOperationId => {
  return ARRAY_OPERATION_IDS.includes(value as ArrayOperationId);
};