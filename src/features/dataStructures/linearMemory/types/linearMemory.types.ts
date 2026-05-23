// Ruta:
// src/features/dataStructures/linearMemory/types/linearMemory.types.ts

/**
 * Tipos internos para visualizaciones de memoria lineal.
 *
 * Importante:
 * - Estos tipos NO pertenecen al catálogo global.
 * - El catálogo solo dice qué estructuras existen.
 * - Aquí definimos qué operaciones internas puede ejecutar cada estructura.
 */

import type { AlgoStepResult } from "../../../../shared/types/runtime.types";

/**
 * Valores visibles en memoria lineal.
 *
 * number:
 * - celda ocupada.
 *
 * null:
 * - celda vacía, usado principalmente en Circular Queue.
 */
export type LinearMemoryValue = number | null;

/* -------------------------------------------------------------------------- */
/* Array                                                                       */
/* -------------------------------------------------------------------------- */

export const ARRAY_OPERATION_IDS = [
  "traverse",
  "search",
  "access",
  "update",
  "push",
  "insert",
  "delete",
] as const;

export type ArrayOperationId = (typeof ARRAY_OPERATION_IDS)[number];

export type ArrayMemoryOperationConfig = {
  operationId: ArrayOperationId;

  searchTarget: number;
  accessIndex: number;

  updateIndex: number;
  updateValue: number;

  pushValue: number;

  insertIndex: number;
  insertValue: number;

  deleteIndex: number;
};

/**
 * Alias conservado para NO romper lo que ya funciona con Array.
 *
 * El runner actual de Array puede seguir usando:
 * LinearMemoryOperationConfig
 */
export type LinearMemoryOperationConfig = ArrayMemoryOperationConfig;

/* -------------------------------------------------------------------------- */
/* Stack                                                                       */
/* -------------------------------------------------------------------------- */

export const STACK_OPERATION_IDS = [
  "traverse",
  "push",
  "pop",
  "peek",
  "is-empty",
] as const;

export type StackOperationId = (typeof STACK_OPERATION_IDS)[number];

export type StackMemoryOperationConfig = {
  operationId: StackOperationId;

  /**
   * Valor que se agrega en push().
   */
  pushValue: number;
};

/* -------------------------------------------------------------------------- */
/* Queue                                                                       */
/* -------------------------------------------------------------------------- */

export const QUEUE_OPERATION_IDS = [
  "traverse",
  "enqueue",
  "dequeue",
  "front",
  "rear",
  "is-empty",
] as const;

export type QueueOperationId = (typeof QUEUE_OPERATION_IDS)[number];

export type QueueMemoryOperationConfig = {
  operationId: QueueOperationId;

  /**
   * Valor que se agrega en enqueue().
   */
  enqueueValue: number;
};

/* -------------------------------------------------------------------------- */
/* Circular Queue                                                              */
/* -------------------------------------------------------------------------- */

export type CircularQueueSlot = number | null;

export const CIRCULAR_QUEUE_OPERATION_IDS = [
  "traverse",
  "enqueue",
  "dequeue",
  "front",
  "rear",
  "is-empty",
  "is-full",
] as const;

export type CircularQueueOperationId =
  (typeof CIRCULAR_QUEUE_OPERATION_IDS)[number];

export type CircularQueueMemoryOperationConfig = {
  operationId: CircularQueueOperationId;

  /**
   * Valor que se agrega en enqueue().
   */
  enqueueValue: number;

  /**
   * Capacidad física de la cola circular.
   */
  capacity: number;

  /**
   * Índice físico de FRONT.
   */
  frontIndex: number;

  /**
   * Índice físico de REAR.
   */
  rearIndex: number;

  /**
   * Cantidad de elementos ocupados.
   */
  size: number;
};

/* -------------------------------------------------------------------------- */
/* Configuraciones genéricas                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Configuración para las nuevas estructuras que usarán LinearMemoryCells.
 *
 * No incluye Array porque Array conserva su flujo actual.
 */
export type GenericLinearMemoryOperationConfig =
  | StackMemoryOperationConfig
  | QueueMemoryOperationConfig
  | CircularQueueMemoryOperationConfig;

/**
 * Configuración total posible si más adelante necesitas una unión completa.
 */
export type AnyLinearMemoryOperationConfig =
  | ArrayMemoryOperationConfig
  | GenericLinearMemoryOperationConfig;

/* -------------------------------------------------------------------------- */
/* Snapshot                                                                    */
/* -------------------------------------------------------------------------- */

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
  activeValue?: number | null;

  targetValue?: number;

  accessIndex?: number;

  updateIndex?: number;
  updateValue?: number;
  previousValue?: number | null;

  pushValue?: number;

  insertIndex?: number;
  insertValue?: number;

  deleteIndex?: number;

  enqueueValue?: number;

  topIndex?: number;
  frontIndex?: number;
  rearIndex?: number;

  capacity?: number;
  size?: number;

  result?: AlgoStepResult;
};

/* -------------------------------------------------------------------------- */
/* Type guards                                                                 */
/* -------------------------------------------------------------------------- */

export const isArrayOperationId = (
  value: string,
): value is ArrayOperationId => {
  return ARRAY_OPERATION_IDS.includes(value as ArrayOperationId);
};

export const isStackOperationId = (
  value: string,
): value is StackOperationId => {
  return STACK_OPERATION_IDS.includes(value as StackOperationId);
};

export const isQueueOperationId = (
  value: string,
): value is QueueOperationId => {
  return QUEUE_OPERATION_IDS.includes(value as QueueOperationId);
};

export const isCircularQueueOperationId = (
  value: string,
): value is CircularQueueOperationId => {
  return CIRCULAR_QUEUE_OPERATION_IDS.includes(
    value as CircularQueueOperationId,
  );
};