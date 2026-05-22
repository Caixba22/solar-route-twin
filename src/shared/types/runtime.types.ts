// Ruta:
// src/shared/types/runtime.types.ts

/**
 * RuntimeStatus
 *
 * Estados globales de reproducción del algoritmo o visualización.
 */
export type RuntimeStatus = "idle" | "running" | "paused" | "finished";

/**
 * AlgoStepType
 *
 * Tipos visuales generales que puede emitir una visualización.
 *
 * Estos tipos no ejecutan nada por sí solos.
 * Cada runner decide cómo interpretarlos.
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
 * AlgoStepResult
 *
 * Resultado semántico opcional de un paso.
 *
 * Se usa para que la interfaz pueda explicar qué ocurrió sin mezclar
 * lógica visual 3D con texto de UI.
 */
export type AlgoStepResult =
  | "visiting"
  | "comparing"
  | "found"
  | "not-found"
  | "accessed"
  | "finished";

/**
 * AlgoStep
 *
 * Paso visual emitido por un generador.
 *
 * activeIndices:
 * - Grupo principal de índices afectados.
 *
 * pivotIndices:
 * - Permite pintar pivotes con color propio.
 *
 * boundaryIndices:
 * - Permite pintar límites, rangos o fronteras.
 *
 * comparingIndices:
 * - Permite diferenciar elementos comparados.
 *
 * sortedIndices:
 * - Permite marcar elementos finalizados, visitados o confirmados.
 *
 * result:
 * - Describe qué ocurrió de forma semántica.
 * - Sirve para paneles informativos, mensajes o cambios especiales.
 *
 * description:
 * - Texto breve para explicar el paso actual al usuario.
 *
 * currentLabel:
 * - Etiqueta visual sugerida para el puntero.
 * - Ejemplo: CURRENT, FOUND, ACCESS.
 */
export type AlgoStep = {
  type: AlgoStepType;
  activeIndices: number[];
  pivotIndices?: number[];
  boundaryIndices?: number[];
  comparingIndices?: number[];
  sortedIndices?: number[];
  result?: AlgoStepResult;
  description?: string;
  currentLabel?: string;
};