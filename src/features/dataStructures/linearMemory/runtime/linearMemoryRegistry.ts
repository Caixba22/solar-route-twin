// Ruta:
// src/features/dataStructures/linearMemory/runtime/linearMemoryRegistry.ts

/**
 * linearMemoryRegistry
 *
 * Registro técnico de estructuras de memoria lineal soportadas.
 *
 * Importante:
 * - Array conserva su runner actual.
 * - Stack, Queue y Circular Queue usarán el runner genérico.
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";

import type {
  ArrayMemoryOperationConfig,
  CircularQueueMemoryOperationConfig,
  CircularQueueSlot,
  LinearMemoryOperationConfig,
  QueueMemoryOperationConfig,
  StackMemoryOperationConfig,
} from "../types/linearMemory.types";

import { createArrayOperationGenerator } from "../logic/arrayOperations";
import { createStackOperationGenerator } from "../logic/stackOperations";
import { createQueueOperationGenerator } from "../logic/queueOperations";
import { createCircularQueueOperationGenerator } from "../logic/circularQueueOperations";

/* -------------------------------------------------------------------------- */
/* IDs                                                                         */
/* -------------------------------------------------------------------------- */

export const ARRAY_LINEAR_MEMORY_STRUCTURE_IDS = ["array"] as const;

export const GENERIC_LINEAR_MEMORY_STRUCTURE_IDS = [
  "stack",
  "queue",
  "circular-queue",
] as const;

export const LINEAR_MEMORY_STRUCTURE_IDS = [
  ...ARRAY_LINEAR_MEMORY_STRUCTURE_IDS,
  ...GENERIC_LINEAR_MEMORY_STRUCTURE_IDS,
] as const;

export type ArrayLinearMemoryStructureId =
  (typeof ARRAY_LINEAR_MEMORY_STRUCTURE_IDS)[number];

export type GenericLinearMemoryStructureId =
  (typeof GENERIC_LINEAR_MEMORY_STRUCTURE_IDS)[number];

export type LinearMemoryStructureId =
  (typeof LINEAR_MEMORY_STRUCTURE_IDS)[number];

/* -------------------------------------------------------------------------- */
/* Factories                                                                   */
/* -------------------------------------------------------------------------- */

type ArrayLinearMemoryGeneratorFactory = (
  values: number[],
  config: LinearMemoryOperationConfig,
) => Generator<AlgoStep, void, unknown>;

type StackLinearMemoryGeneratorFactory = (
  values: number[],
  config: StackMemoryOperationConfig,
) => Generator<AlgoStep, void, unknown>;

type QueueLinearMemoryGeneratorFactory = (
  values: number[],
  config: QueueMemoryOperationConfig,
) => Generator<AlgoStep, void, unknown>;

type CircularQueueLinearMemoryGeneratorFactory = (
  values: CircularQueueSlot[],
  config: CircularQueueMemoryOperationConfig,
) => Generator<AlgoStep, void, unknown>;

const ARRAY_LINEAR_MEMORY_GENERATOR_FACTORIES = {
  array: createArrayOperationGenerator,
} satisfies Record<
  ArrayLinearMemoryStructureId,
  ArrayLinearMemoryGeneratorFactory
>;

const GENERIC_LINEAR_MEMORY_GENERATOR_FACTORIES = {
  stack: createStackOperationGenerator,
  queue: createQueueOperationGenerator,
  "circular-queue": createCircularQueueOperationGenerator,
} satisfies {
  stack: StackLinearMemoryGeneratorFactory;
  queue: QueueLinearMemoryGeneratorFactory;
  "circular-queue": CircularQueueLinearMemoryGeneratorFactory;
};

/* -------------------------------------------------------------------------- */
/* Type guards                                                                 */
/* -------------------------------------------------------------------------- */

export const isArrayLinearMemoryStructureId = (
  itemId: string,
): itemId is ArrayLinearMemoryStructureId => {
  return ARRAY_LINEAR_MEMORY_STRUCTURE_IDS.includes(
    itemId as ArrayLinearMemoryStructureId,
  );
};

export const isGenericLinearMemoryStructureId = (
  itemId: string,
): itemId is GenericLinearMemoryStructureId => {
  return GENERIC_LINEAR_MEMORY_STRUCTURE_IDS.includes(
    itemId as GenericLinearMemoryStructureId,
  );
};

export const isLinearMemoryStructureId = (
  itemId: string,
): itemId is LinearMemoryStructureId => {
  return LINEAR_MEMORY_STRUCTURE_IDS.includes(
    itemId as LinearMemoryStructureId,
  );
};

/* -------------------------------------------------------------------------- */
/* Getters                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Factory para Array.
 *
 * Se mantiene para no romper useLinearMemoryRunner actual.
 */
export const getLinearMemoryGeneratorFactory = (
  structureId: ArrayLinearMemoryStructureId,
): ArrayLinearMemoryGeneratorFactory => {
  return ARRAY_LINEAR_MEMORY_GENERATOR_FACTORIES[structureId];
};

/**
 * Factory para Stack, Queue y Circular Queue.
 */
export const getGenericLinearMemoryGeneratorFactory = (
  structureId: GenericLinearMemoryStructureId,
) => {
  return GENERIC_LINEAR_MEMORY_GENERATOR_FACTORIES[structureId];
};