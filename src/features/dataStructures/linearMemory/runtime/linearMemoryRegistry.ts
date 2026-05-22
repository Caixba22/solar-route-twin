// Ruta:
// src/features/dataStructures/linearMemory/runtime/linearMemoryRegistry.ts

/**
 * linearMemoryRegistry
 *
 * Registro técnico de estructuras de memoria lineal soportadas.
 *
 * Responsabilidad:
 * - Definir qué estructuras puede montar LinearMemoryScene.
 * - Asociar cada id del catálogo con su generador visual.
 *
 * Por ahora:
 * - array puede ejecutar operaciones internas como recorrido, búsqueda y acceso.
 *
 * Después aquí podremos conectar:
 * - stack
 * - queue
 * - circular-queue
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";
import type { LinearMemoryOperationConfig } from "../types/linearMemory.types";

import { createArrayOperationGenerator } from "../logic/arrayOperations";

/**
 * Estructuras de memoria lineal conectadas visualmente.
 *
 * Regla:
 * Si agregas un id aquí, debe existir también en CATALOG_ITEMS.
 */
export const LINEAR_MEMORY_STRUCTURE_IDS = ["array"] as const;

/**
 * ID válido para estructuras soportadas por LinearMemoryScene.
 */
export type LinearMemoryStructureId =
  (typeof LINEAR_MEMORY_STRUCTURE_IDS)[number];

/**
 * Forma esperada de cualquier generador de memoria lineal.
 */
type LinearMemoryGeneratorFactory = (
  values: number[],
  config: LinearMemoryOperationConfig,
) => Generator<AlgoStep, void, unknown>;

/**
 * Mapa estructura → generador visual.
 */
const LINEAR_MEMORY_GENERATOR_FACTORIES = {
  array: createArrayOperationGenerator,
} satisfies Record<LinearMemoryStructureId, LinearMemoryGeneratorFactory>;

/**
 * Valida si un string pertenece a las estructuras lineales soportadas.
 */
export const isLinearMemoryStructureId = (
  itemId: string,
): itemId is LinearMemoryStructureId => {
  return LINEAR_MEMORY_STRUCTURE_IDS.includes(
    itemId as LinearMemoryStructureId,
  );
};

/**
 * Devuelve el generador correspondiente a la estructura seleccionada.
 */
export const getLinearMemoryGeneratorFactory = (
  structureId: LinearMemoryStructureId,
): LinearMemoryGeneratorFactory => {
  return LINEAR_MEMORY_GENERATOR_FACTORIES[structureId];
};