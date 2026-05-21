// Ruta:
// src/features/algorithms/sorting/runtime/useSortingRunner.ts

/**
 * useSortingRunner
 *
 * Orquesta la ejecución del ordenamiento.
 * Lee Zustand, ejecuta el generador y modifica las barras directamente en GPU.
 *
 * Responsabilidad:
 * - Ejecutar el algoritmo seleccionado paso a paso.
 * - Actualizar posición/escala de las barras.
 * - Pintar colores por estado usando ALGO_THEME.
 *
 * Importante:
 * - No contiene colores hardcodeados.
 * - No usa estado React para animaciones pesadas.
 * - Usa InstancedMesh directamente para mantener buen rendimiento.
 * - Reutiliza el mismo runner para distintos algoritmos de ordenamiento.
 *
 * Este archivo NO decide qué algoritmos existen.
 * Esa responsabilidad vive en sortingAlgorithmRegistry.ts.
 */

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useAlgoRuntimeStore } from "../../../../store/useAlgoRuntimeStore";
import { ALGO_THEME } from "../../../../shared/constants/theme";
import type { AlgoStep } from "../../../../shared/types/runtime.types";

import {
  applyBarTransform,
  getSafeMaxValue,
} from "../utils/sortingGeometry";

import {
  getSortingGeneratorFactory,
  type SortingAlgorithmId,
} from "./sortingAlgorithmRegistry";

export type { SortingAlgorithmId } from "./sortingAlgorithmRegistry";
export { isSortingAlgorithmId } from "./sortingAlgorithmRegistry";

const colorHelper = new THREE.Color();
const dummy = new THREE.Object3D();

const ensureInstanceColorAttribute = (
  mesh: THREE.InstancedMesh,
  total: number,
) => {
  if (!mesh.instanceColor || mesh.instanceColor.count < total) {
    mesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(total * 3),
      3,
    );
  }
};

/**
 * Pinta una barra individual usando instanceColor.
 */
const paintInstanceColor = (
  mesh: THREE.InstancedMesh,
  index: number,
  color: THREE.Color,
) => {
  if (!mesh.instanceColor) return;

  mesh.instanceColor.setXYZ(index, color.r, color.g, color.b);
};

/**
 * Confirma la actualización de colores en GPU.
 */
const commitInstanceColors = (mesh: THREE.InstancedMesh) => {
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }
};

/**
 * Confirma la actualización de matrices en GPU.
 */
const commitInstanceMatrices = (mesh: THREE.InstancedMesh) => {
  mesh.instanceMatrix.needsUpdate = true;
};

/**
 * Fuerza actualización del material.
 * Esto ayuda a que Three.js recompile el shader con instanceColor activo.
 */
const forceMaterialUpdate = (mesh: THREE.InstancedMesh) => {
  const materials = Array.isArray(mesh.material)
    ? mesh.material
    : [mesh.material];

  materials.forEach((material) => {
    material.needsUpdate = true;
  });
};

export const useSortingRunner = (
  meshRef: RefObject<THREE.InstancedMesh | null>,
  initialArray: number[],
  algorithmId: SortingAlgorithmId,
) => {
  const status = useAlgoRuntimeStore((state) => state.status);
  const speed = useAlgoRuntimeStore((state) => state.speed);
  const finish = useAlgoRuntimeStore((state) => state.finish);

  const generatorRef = useRef<Generator<AlgoStep, void, unknown> | null>(null);
  const arrayCopyRef = useRef<number[]>([...initialArray]);
  const maxValueRef = useRef<number>(getSafeMaxValue(initialArray));
  const sortedIndicesRef = useRef<Set<number>>(new Set());
  const timerRef = useRef<number>(0);
  const needsVisualResetRef = useRef<boolean>(true);

  const colors = useMemo(
    () => ({
      default: new THREE.Color(ALGO_THEME.data.default),
      comparing: new THREE.Color(ALGO_THEME.data.comparing),
      active: new THREE.Color(ALGO_THEME.data.active),
      sorted: new THREE.Color(ALGO_THEME.data.sorted),
      critical: new THREE.Color(ALGO_THEME.data.critical),
      pivot: new THREE.Color(ALGO_THEME.data.pivot),
      boundary: new THREE.Color(ALGO_THEME.data.boundary),
    }),
    [],
  );

  const resetInternalRuntime = () => {
    const createGenerator = getSortingGeneratorFactory(algorithmId);

    arrayCopyRef.current = [...initialArray];
    maxValueRef.current = getSafeMaxValue(initialArray);
    sortedIndicesRef.current = new Set();
    timerRef.current = 0;
    generatorRef.current = createGenerator(arrayCopyRef.current);
    needsVisualResetRef.current = true;
  };

  const getStepColor = (stepType: AlgoStep["type"]) => {
    if (stepType === "comparing") return colors.comparing;
    if (stepType === "active") return colors.active;
    if (stepType === "sorted") return colors.sorted;
    if (stepType === "critical") return colors.critical;
    if (stepType === "pivot") return colors.pivot;
    if (stepType === "boundary") return colors.boundary;

    return colors.default;
  };

  const applySnapshotToMesh = (mesh: THREE.InstancedMesh) => {
    const values = arrayCopyRef.current;
    const total = values.length;

    mesh.count = total;

    ensureInstanceColorAttribute(mesh, total);

    for (let index = 0; index < total; index++) {
      applyBarTransform(
        dummy,
        index,
        total,
        values[index],
        maxValueRef.current,
      );

      mesh.setMatrixAt(index, dummy.matrix);
      paintInstanceColor(mesh, index, colors.default);
    }

    commitInstanceMatrices(mesh);
    commitInstanceColors(mesh);
    forceMaterialUpdate(mesh);
  };

  const paintFinishedState = (mesh: THREE.InstancedMesh) => {
    const total = arrayCopyRef.current.length;

    ensureInstanceColorAttribute(mesh, total);

    for (let index = 0; index < total; index++) {
      paintInstanceColor(mesh, index, colors.sorted);
    }

    commitInstanceColors(mesh);
    forceMaterialUpdate(mesh);
  };

  /**
   * Pinta un conjunto de índices con un color específico.
   */
  const paintIndices = (
    mesh: THREE.InstancedMesh,
    indices: number[] | undefined,
    total: number,
    color: THREE.Color,
  ) => {
    if (!indices) return;

    indices.forEach((index) => {
      if (index < 0 || index >= total) return;

      colorHelper.copy(color);
      paintInstanceColor(mesh, index, colorHelper);
    });
  };

  /**
   * Reinicia el runtime interno cuando cambia:
   * - el arreglo inicial,
   * - o el algoritmo seleccionado.
   */
  useEffect(() => {
    resetInternalRuntime();
  }, [initialArray, algorithmId]);

  /**
   * Cuando el runtime global vuelve a idle,
   * se reinicia también el generador interno.
   */
  useEffect(() => {
    if (status === "idle") {
      resetInternalRuntime();
    }
  }, [status]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;

    if (!mesh) return;

    if (needsVisualResetRef.current) {
      applySnapshotToMesh(mesh);
      needsVisualResetRef.current = false;
    }

    if (status === "finished") {
      paintFinishedState(mesh);
      return;
    }

    if (status !== "running") return;

    const generator = generatorRef.current;

    if (!generator) return;

    const total = arrayCopyRef.current.length;

    if (total === 0) return;

    ensureInstanceColorAttribute(mesh, total);

    const safeSpeed = Math.max(speed, 1);
    const visualInterval = Math.max(0.016, 0.22 / safeSpeed);

    timerRef.current += delta;

    if (timerRef.current < visualInterval && safeSpeed < 8) return;

    timerRef.current = 0;

    const stepsThisFrame =
      safeSpeed >= 8 ? Math.min(80, Math.floor(safeSpeed)) : 1;

    let lastStep: AlgoStep | null = null;
    let shouldUpdateMatrices = false;

    for (let stepIndex = 0; stepIndex < stepsThisFrame; stepIndex++) {
      const result = generator.next();

      if (result.done) {
        paintFinishedState(mesh);
        finish();
        return;
      }

      lastStep = result.value;

      /**
       * active significa que el arreglo cambió físicamente,
       * por ejemplo, por swap, inserción o desplazamiento.
       */
      if (lastStep.type === "active") {
        shouldUpdateMatrices = true;
      }

      /**
       * sorted conserva los índices que ya quedaron ordenados.
       *
       * Si el algoritmo manda sortedIndices, usamos esos.
       * Si no, mantenemos compatibilidad con activeIndices.
       */
      if (lastStep.type === "sorted") {
        const indicesToStore =
          lastStep.sortedIndices ?? lastStep.activeIndices;

        indicesToStore.forEach((index) => {
          if (index >= 0 && index < total) {
            sortedIndicesRef.current.add(index);
          }
        });
      }
    }

    if (!lastStep) return;

    /**
     * Primero repintamos todo en default o sorted.
     */
    for (let index = 0; index < total; index++) {
      const isSorted = sortedIndicesRef.current.has(index);

      colorHelper.copy(isSorted ? colors.sorted : colors.default);
      paintInstanceColor(mesh, index, colorHelper);
    }

    /**
     * Luego pintamos el grupo principal según el tipo del paso.
     */
    const stepColor = getStepColor(lastStep.type);

    paintIndices(mesh, lastStep.activeIndices, total, stepColor);

    /**
     * Después pintamos roles específicos.
     *
     * Este orden es intencional:
     * - comparing puede marcar el elemento escaneado.
     * - boundary puede marcar la frontera de partición.
     * - pivot se pinta al final para que siempre destaque.
     */
    paintIndices(mesh, lastStep.comparingIndices, total, colors.comparing);
    paintIndices(mesh, lastStep.boundaryIndices, total, colors.boundary);
    paintIndices(mesh, lastStep.pivotIndices, total, colors.pivot);

    /**
     * Si hubo cambio físico en el arreglo, actualizamos matrices.
     */
    if (shouldUpdateMatrices) {
      arrayCopyRef.current.forEach((value, index) => {
        applyBarTransform(
          dummy,
          index,
          total,
          value,
          maxValueRef.current,
        );

        mesh.setMatrixAt(index, dummy.matrix);
      });

      commitInstanceMatrices(mesh);
    }

    commitInstanceColors(mesh);
  });
};