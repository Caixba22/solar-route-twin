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
  "update",
  "push",
  "insert",
  "delete",
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
 *
 * update:
 * - Accede directamente a una posición y actualiza su valor.
 *
 * push:
 * - Agrega un valor al final del array.
 *
 * insert:
 * - Inserta un valor en una posición específica.
 *
 * delete:
 * - Elimina un valor por índice.
 */
export type ArrayOperationId = (typeof ARRAY_OPERATION_IDS)[number];

export type LinearMemoryOperationConfig = {
  operationId: ArrayOperationId;

  /**
   * Valor objetivo para búsqueda lineal.
   */
  searchTarget: number;

  /**
   * Índice usado para acceso directo.
   */
  accessIndex: number;

  /**
   * Índice usado para actualización directa.
   */
  updateIndex: number;

  /**
   * Nuevo valor que se colocará en updateIndex.
   */
  updateValue: number;

  /**
   * Valor que se agregará al final del array.
   */
  pushValue: number;

  /**
   * Índice donde se insertará un nuevo valor.
   */
  insertIndex: number;

  /**
   * Valor que se insertará en insertIndex.
   */
  insertValue: number;

  /**
   * Índice que se eliminará del array.
   */
  deleteIndex: number;
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
  updateIndex?: number;
  updateValue?: number;
  previousValue?: number;
  pushValue?: number;
  insertIndex?: number;
  insertValue?: number;
  deleteIndex?: number;
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