// Ruta:
// src/features/dataStructures/linearMemory/utils/linearMemoryGeometry.ts

import * as THREE from "three";

/**
 * Medidas base para celdas de memoria lineal.
 *
 * Se usan para:
 * - Array
 * - Stack
 * - Queue
 *
 * Importante:
 * Las celdas tienen el mismo tamaño porque representan posiciones
 * de memoria o espacios lógicos equivalentes.
 */
const CELL_WIDTH = 1.05;
const CELL_HEIGHT = 0.8;
const CELL_DEPTH = 0.8;
const CELL_SPACING = 1.25;

/**
 * Calcula la posición horizontal de una celda.
 *
 * Centra todo el arreglo en el eje X.
 */
export const getLinearCellPosition = (
  index: number,
  total: number,
): [number, number, number] => {
  const x = (index - (total - 1) / 2) * CELL_SPACING;

  return [x, 1.2, 0];
};

/**
 * Aplica la transformación de una celda.
 *
 * Se usa tanto al crear la visualización como al resetear el runtime.
 */
export const applyLinearCellTransform = (
  object: THREE.Object3D,
  index: number,
  total: number,
) => {
  const [x, y, z] = getLinearCellPosition(index, total);

  object.position.set(x, y, z);
  object.scale.set(CELL_WIDTH, CELL_HEIGHT, CELL_DEPTH);
  object.rotation.set(0, 0, 0);
  object.updateMatrix();
};