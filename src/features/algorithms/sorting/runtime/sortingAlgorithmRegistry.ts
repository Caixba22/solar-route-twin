// src/features/algorithms/sorting/runtime/sortingAlgorithmRegistry.ts

import type { AlgoStep } from "../../../../shared/types/runtime.types";

import { bubbleSortGenerator } from "../logic/bubbleSort";
import { selectionSortGenerator } from "../logic/selectionSort";
import { insertionSortGenerator } from "../logic/insertionSort";
import { quickSortGenerator } from "../logic/quickSort";
import { mergeSortGenerator } from "../logic/mergeSort";
import { heapSortGenerator } from "../logic/heapSort";
import { countingSortGenerator } from "../logic/countingSort";

export const SORTING_ALGORITHM_IDS = [
  "bubble-sort",
  "selection-sort",
  "insertion-sort",
  "quick-sort",
  "merge-sort",
  "heap-sort",
  "counting-sort",
] as const;

export type SortingAlgorithmId = (typeof SORTING_ALGORITHM_IDS)[number];

type SortingGeneratorFactory = (
  values: number[],
) => Generator<AlgoStep, void, unknown>;

const SORTING_GENERATOR_FACTORIES = {
  "bubble-sort": bubbleSortGenerator,
  "selection-sort": selectionSortGenerator,
  "insertion-sort": insertionSortGenerator,
  "quick-sort": quickSortGenerator,
  "merge-sort": mergeSortGenerator,
  "heap-sort": heapSortGenerator,
  "counting-sort": countingSortGenerator,
} satisfies Record<SortingAlgorithmId, SortingGeneratorFactory>;

export const isSortingAlgorithmId = (
  itemId: string,
): itemId is SortingAlgorithmId => {
  return SORTING_ALGORITHM_IDS.includes(itemId as SortingAlgorithmId);
};

export const getSortingGeneratorFactory = (
  algorithmId: SortingAlgorithmId,
): SortingGeneratorFactory => {
  return SORTING_GENERATOR_FACTORIES[algorithmId];
};