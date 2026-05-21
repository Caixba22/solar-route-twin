// Ruta:
// src/shared/types/runtime.types.ts

/**
 * RuntimeStatus
 *
 * Estados globales de reproducción del algoritmo.
 */
export type RuntimeStatus = "idle" | "running" | "paused" | "finished";

/**
 * AlgoStepType
 *
 * Tipos visuales generales que puede emitir un algoritmo.
 *
 * Estos tipos no ejecutan nada por sí solos.
 * useSortingRunner los interpreta para pintar barras y actualizar matrices.
 */
export type AlgoStepType =
  | "default"
  | "active"
  | "comparing"
  | "sorted"
  | "critical"
  | "pivot"
  | "boundary";

/**
 * AlgoStep
 *
 * Paso visual emitido por un generador de algoritmo.
 *
 * activeIndices:
 * - Mantiene compatibilidad con Bubble Sort, Selection Sort e Insertion Sort.
 * - Es el grupo principal de índices que se pintan según type.
 *
 * pivotIndices:
 * - Permite pintar pivotes con color propio.
 *
 * boundaryIndices:
 * - Permite pintar fronteras de partición, por ejemplo en Quick Sort.
 *
 * comparingIndices:
 * - Permite diferenciar el elemento comparado del pivote.
 *
 * sortedIndices:
 * - Permite marcar ordenados sin depender solo de activeIndices.
 */
export type AlgoStep = {
  type: AlgoStepType;
  activeIndices: number[];
  pivotIndices?: number[];
  boundaryIndices?: number[];
  comparingIndices?: number[];
  sortedIndices?: number[];
};