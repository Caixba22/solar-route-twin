// Ruta:
// src/features/algorithms/sorting/runtime/sortingAlgorithmRegistry.ts

/**
 * sortingAlgorithmRegistry
 *
 * Registro técnico de algoritmos de ordenamiento soportados por SortingScene.
 *
 * Responsabilidad:
 * - Definir qué algoritmos de ordenamiento puede ejecutar el runner.
 * - Asociar cada id del catálogo con su generador correspondiente.
 *
 * Importante:
 * - Este archivo NO renderiza nada.
 * - Este archivo NO usa React.
 * - Este archivo NO usa Zustand.
 * - Este archivo NO usa Three.js.
 *
 * ¿Por qué existe?
 * Para evitar que useSortingRunner.ts crezca con muchos imports,
 * muchos if y muchas condiciones cada vez que agregues un algoritmo.
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";

import { bubbleSortGenerator } from "../logic/bubbleSort";
import { selectionSortGenerator } from "../logic/selectionSort";
import { insertionSortGenerator } from "../logic/insertionSort";
import { quickSortGenerator } from "../logic/quickSort";
import { mergeSortGenerator } from "../logic/mergeSort";
import { heapSortGenerator } from "../logic/heapSort";
import { countingSortGenerator } from "../logic/countingSort";

/**
 * Lista de algoritmos de ordenamiento que ya pueden usar SortingScene.
 *
 * Regla:
 * Si agregas aquí un id, debe existir:
 * - su item en CATALOG_ITEMS,
 * - su generador en logic/,
 * - su entrada en SORTING_GENERATOR_FACTORIES.
 */
export const SORTING_ALGORITHM_IDS = [
  "bubble-sort",
  "selection-sort",
  "insertion-sort",
  "quick-sort",
  "merge-sort",
  "heap-sort",
  "counting-sort",
] as const;

/**
 * ID válido de algoritmo de ordenamiento soportado por esta escena.
 */
export type SortingAlgorithmId = (typeof SORTING_ALGORITHM_IDS)[number];

/**
 * Forma esperada de cualquier generador de ordenamiento.
 *
 * Todos los algoritmos deben:
 * - recibir un number[],
 * - mutar ese arreglo interno,
 * - emitir pasos AlgoStep.
 */
type SortingGeneratorFactory = (
  values: number[],
) => Generator<AlgoStep, void, unknown>;

/**
 * Mapa central de algoritmo → generador.
 *
 * Aquí se conecta el id del catálogo con la lógica real del algoritmo.
 */
const SORTING_GENERATOR_FACTORIES = {
  "bubble-sort": bubbleSortGenerator,
  "selection-sort": selectionSortGenerator,
  "insertion-sort": insertionSortGenerator,
  "quick-sort": quickSortGenerator,
  "merge-sort": mergeSortGenerator,
  "heap-sort": heapSortGenerator,
  "counting-sort": countingSortGenerator,
} satisfies Record<SortingAlgorithmId, SortingGeneratorFactory>;

/**
 * Valida si un string pertenece a los algoritmos que SortingScene soporta.
 *
 * Se usa desde la UI para saber si un item del catálogo puede montarse
 * dentro de la escena de ordenamiento.
 */
export const isSortingAlgorithmId = (
  itemId: string,
): itemId is SortingAlgorithmId => {
  return SORTING_ALGORITHM_IDS.includes(itemId as SortingAlgorithmId);
};

/**
 * Devuelve el generador correspondiente al algoritmo seleccionado.
 *
 * useSortingRunner usa esta función para no tener que conocer
 * directamente todos los algoritmos existentes.
 */
export const getSortingGeneratorFactory = (
  algorithmId: SortingAlgorithmId,
): SortingGeneratorFactory => {
  return SORTING_GENERATOR_FACTORIES[algorithmId];
};