// src/features/dataStructures/linearMemory/runtime/useLinearMemoryRunner.ts

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useAlgoRuntimeStore } from "../../../../store/useAlgoRuntimeStore";
import { ALGO_THEME } from "../../../../shared/constants/theme";
import type { AlgoStep } from "../../../../shared/types/runtime.types";

import {
  applyLinearCellTransform,
  getLinearCellPosition,
} from "../utils/linearMemoryGeometry";

import type {
  LinearMemoryOperationConfig,
  LinearMemoryRuntimeSnapshot,
} from "../types/linearMemory.types";

import {
  getLinearMemoryGeneratorFactory,
  type ArrayLinearMemoryStructureId,
} from "./linearMemoryRegistry";

export type {
  ArrayLinearMemoryStructureId,
  LinearMemoryStructureId,
  GenericLinearMemoryStructureId,
} from "./linearMemoryRegistry";

export {
  isArrayLinearMemoryStructureId,
  isGenericLinearMemoryStructureId,
  isLinearMemoryStructureId,
} from "./linearMemoryRegistry";

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

const paintInstanceColor = (
  mesh: THREE.InstancedMesh,
  index: number,
  color: THREE.Color,
) => {
  if (!mesh.instanceColor) return;

  mesh.instanceColor.setXYZ(index, color.r, color.g, color.b);
};

const commitInstanceColors = (mesh: THREE.InstancedMesh) => {
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }
};

const commitInstanceMatrices = (mesh: THREE.InstancedMesh) => {
  mesh.instanceMatrix.needsUpdate = true;
};

const forceMaterialUpdate = (mesh: THREE.InstancedMesh) => {
  const materials = Array.isArray(mesh.material)
    ? mesh.material
    : [mesh.material];

  materials.forEach((material) => {
    material.needsUpdate = true;
  });
};

const hidePointer = (pointerRef: RefObject<THREE.Group | null>) => {
  const pointer = pointerRef.current;

  if (!pointer) return;

  pointer.visible = false;
};

const hidePointers = (
  currentPointerRef: RefObject<THREE.Group | null>,
  foundPointerRef: RefObject<THREE.Group | null>,
) => {
  hidePointer(currentPointerRef);
  hidePointer(foundPointerRef);
};

const movePointer = (
  pointerRef: RefObject<THREE.Group | null>,
  index: number,
  total: number,
) => {
  const pointer = pointerRef.current;

  if (!pointer || index < 0 || index >= total) return;

  const [x, y, z] = getLinearCellPosition(index, total);

  pointer.position.set(x, y + 1.05, z + 0.05);
  pointer.visible = true;
};

const getOperationLabel = (
  operationConfig: LinearMemoryOperationConfig,
): string => {
  if (operationConfig.operationId === "search") return "Buscar valor";
  if (operationConfig.operationId === "access") return "Acceder por índice";
  if (operationConfig.operationId === "update") return "Actualizar valor";
  if (operationConfig.operationId === "push") return "Agregar al final";
  if (operationConfig.operationId === "insert") return "Insertar por índice";
  if (operationConfig.operationId === "delete") return "Eliminar por índice";

  return "Recorrer array";
};

const createIdleSnapshot = (
  operationConfig: LinearMemoryOperationConfig,
): LinearMemoryRuntimeSnapshot => {
  if (operationConfig.operationId === "search") {
    return {
      operationLabel: "Buscar valor",
      statusLabel: "En espera",
      description: `Presiona Play para buscar el valor ${operationConfig.searchTarget} dentro del array.`,
      targetValue: operationConfig.searchTarget,
      result: "visiting",
    };
  }

  if (operationConfig.operationId === "access") {
    return {
      operationLabel: "Acceder por índice",
      statusLabel: "En espera",
      description: `Presiona Play para acceder directamente al índice ${operationConfig.accessIndex}.`,
      accessIndex: operationConfig.accessIndex,
      result: "visiting",
    };
  }

  if (operationConfig.operationId === "update") {
    return {
      operationLabel: "Actualizar valor",
      statusLabel: "En espera",
      description: `Presiona Play para actualizar array[${operationConfig.updateIndex}] con el valor ${operationConfig.updateValue}.`,
      updateIndex: operationConfig.updateIndex,
      updateValue: operationConfig.updateValue,
      result: "visiting",
    };
  }

  if (operationConfig.operationId === "push") {
    return {
      operationLabel: "Agregar al final",
      statusLabel: "En espera",
      description: `Presiona Play para agregar el valor ${operationConfig.pushValue} al final del array.`,
      pushValue: operationConfig.pushValue,
      result: "visiting",
    };
  }

  if (operationConfig.operationId === "insert") {
    return {
      operationLabel: "Insertar por índice",
      statusLabel: "En espera",
      description: `Presiona Play para insertar el valor ${operationConfig.insertValue} en el índice ${operationConfig.insertIndex}.`,
      insertIndex: operationConfig.insertIndex,
      insertValue: operationConfig.insertValue,
      result: "visiting",
    };
  }

  if (operationConfig.operationId === "delete") {
    return {
      operationLabel: "Eliminar por índice",
      statusLabel: "En espera",
      description: `Presiona Play para eliminar el valor ubicado en el índice ${operationConfig.deleteIndex}.`,
      deleteIndex: operationConfig.deleteIndex,
      result: "visiting",
    };
  }

  return {
    operationLabel: "Recorrer array",
    statusLabel: "En espera",
    description: "Presiona Play para recorrer el array de izquierda a derecha.",
    result: "visiting",
  };
};

const createSnapshotFromStep = (
  step: AlgoStep,
  values: number[],
  operationConfig: LinearMemoryOperationConfig,
): LinearMemoryRuntimeSnapshot => {
  const activeIndex =
    step.activeIndices.length === 1 ? step.activeIndices[0] : undefined;

  const activeValue =
    activeIndex !== undefined && activeIndex >= 0 && activeIndex < values.length
      ? values[activeIndex]
      : undefined;

  const baseSnapshot: LinearMemoryRuntimeSnapshot = {
    operationLabel: getOperationLabel(operationConfig),
    statusLabel: step.currentLabel ?? "Paso actual",
    description: step.description ?? "Ejecutando visualización.",
    activeIndex,
    activeValue,
    targetValue:
      operationConfig.operationId === "search"
        ? operationConfig.searchTarget
        : undefined,
    accessIndex:
      operationConfig.operationId === "access"
        ? operationConfig.accessIndex
        : undefined,
    updateIndex:
      operationConfig.operationId === "update"
        ? operationConfig.updateIndex
        : undefined,
    updateValue:
      operationConfig.operationId === "update"
        ? operationConfig.updateValue
        : undefined,
    previousValue:
      operationConfig.operationId === "update" ? activeValue : undefined,
    pushValue:
      operationConfig.operationId === "push"
        ? operationConfig.pushValue
        : undefined,
    insertIndex:
      operationConfig.operationId === "insert"
        ? operationConfig.insertIndex
        : undefined,
    insertValue:
      operationConfig.operationId === "insert"
        ? operationConfig.insertValue
        : undefined,
    deleteIndex:
      operationConfig.operationId === "delete"
        ? operationConfig.deleteIndex
        : undefined,
    result: step.result,
  };

  if (step.result === "found") {
    return {
      ...baseSnapshot,
      statusLabel: "Encontrado",
    };
  }

  if (step.result === "not-found") {
    return {
      ...baseSnapshot,
      statusLabel: "No encontrado",
    };
  }

  if (
    step.result === "accessed" &&
    operationConfig.operationId === "update"
  ) {
    return {
      ...baseSnapshot,
      statusLabel: "Actualizando",
    };
  }

  if (step.result === "accessed") {
    return {
      ...baseSnapshot,
      statusLabel: "Acceso directo",
    };
  }

  if (step.result === "finished") {
    if (operationConfig.operationId === "update") {
      return {
        ...baseSnapshot,
        statusLabel: "Actualizado",
      };
    }

    if (operationConfig.operationId === "push") {
      return {
        ...baseSnapshot,
        statusLabel: "Agregado",
      };
    }

    if (operationConfig.operationId === "insert") {
      return {
        ...baseSnapshot,
        statusLabel: "Insertado",
      };
    }

    if (operationConfig.operationId === "delete") {
      return {
        ...baseSnapshot,
        statusLabel: "Eliminado",
      };
    }

    return {
      ...baseSnapshot,
      statusLabel: "Finalizado",
    };
  }

  return baseSnapshot;
};

export const useLinearMemoryRunner = (
  meshRef: RefObject<THREE.InstancedMesh | null>,
  currentPointerRef: RefObject<THREE.Group | null>,
  foundPointerRef: RefObject<THREE.Group | null>,
  values: number[],
  structureId: ArrayLinearMemoryStructureId,
  operationConfig: LinearMemoryOperationConfig,
  onRuntimeSnapshotChange?: (
    snapshot: LinearMemoryRuntimeSnapshot,
  ) => void,
) => {
  const status = useAlgoRuntimeStore((state) => state.status);
  const speed = useAlgoRuntimeStore((state) => state.speed);
  const finish = useAlgoRuntimeStore((state) => state.finish);

  const generatorRef = useRef<Generator<AlgoStep, void, unknown> | null>(null);
  const visitedIndicesRef = useRef<Set<number>>(new Set());
  const timerRef = useRef<number>(0);
  const needsVisualResetRef = useRef<boolean>(true);
  const previousValuesLengthRef = useRef<number>(values.length);

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
    const createGenerator = getLinearMemoryGeneratorFactory(structureId);

    visitedIndicesRef.current = new Set();
    timerRef.current = 0;
    generatorRef.current = createGenerator([...values], operationConfig);
    needsVisualResetRef.current = true;

    hidePointers(currentPointerRef, foundPointerRef);
    onRuntimeSnapshotChange?.(createIdleSnapshot(operationConfig));
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
    const total = values.length;

    mesh.count = total;

    ensureInstanceColorAttribute(mesh, total);

    for (let index = 0; index < total; index++) {
      applyLinearCellTransform(dummy, index, total);

      mesh.setMatrixAt(index, dummy.matrix);
      paintInstanceColor(mesh, index, colors.default);
    }

    commitInstanceMatrices(mesh);
    commitInstanceColors(mesh);
    forceMaterialUpdate(mesh);
    hidePointers(currentPointerRef, foundPointerRef);
  };

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

  const updatePointersFromStep = (step: AlgoStep, total: number) => {
    const hasSingleActiveIndex = step.activeIndices.length === 1;

    if (!hasSingleActiveIndex) {
      hidePointers(currentPointerRef, foundPointerRef);
      return;
    }

    const activeIndex = step.activeIndices[0];

    if (step.result === "found") {
      hidePointer(currentPointerRef);
      movePointer(foundPointerRef, activeIndex, total);
      return;
    }

    hidePointer(foundPointerRef);
    movePointer(currentPointerRef, activeIndex, total);
  };

  const applyVisualStep = (
    mesh: THREE.InstancedMesh,
    step: AlgoStep,
  ) => {
    const total = values.length;

    if (step.sortedIndices) {
      step.sortedIndices.forEach((index) => {
        if (index >= 0 && index < total) {
          visitedIndicesRef.current.add(index);
        }
      });
    }

    for (let index = 0; index < total; index++) {
      const isVisited = visitedIndicesRef.current.has(index);

      paintInstanceColor(
        mesh,
        index,
        isVisited ? colors.sorted : colors.default,
      );
    }

    paintIndices(mesh, step.boundaryIndices, total, colors.boundary);
    paintIndices(mesh, step.comparingIndices, total, colors.comparing);

    const stepColor = getStepColor(step.type);
    paintIndices(mesh, step.activeIndices, total, stepColor);

    updatePointersFromStep(step, total);

    onRuntimeSnapshotChange?.(
      createSnapshotFromStep(step, values, operationConfig),
    );

    commitInstanceColors(mesh);
  };

  useEffect(() => {
    if (status !== "idle") return;

    resetInternalRuntime();
  }, [values, structureId, operationConfig, status]);

  useEffect(() => {
    const previousLength = previousValuesLengthRef.current;

    previousValuesLengthRef.current = values.length;

    if (status === "finished" && previousLength !== values.length) {
      needsVisualResetRef.current = true;
    }
  }, [values.length, status]);

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

    if (status === "finished") return;

    if (status !== "running") return;

    const generator = generatorRef.current;

    if (!generator) return;

    const total = values.length;

    if (total === 0) return;

    ensureInstanceColorAttribute(mesh, total);

    const safeSpeed = Math.max(speed, 1);
    const visualInterval = Math.max(0.016, 0.42 / safeSpeed);

    timerRef.current += delta;

    if (timerRef.current < visualInterval && safeSpeed < 8) return;

    timerRef.current = 0;

    const stepsThisFrame =
      safeSpeed >= 8 ? Math.min(40, Math.floor(safeSpeed)) : 1;

    let lastStep: AlgoStep | null = null;

    for (let stepIndex = 0; stepIndex < stepsThisFrame; stepIndex++) {
      const result = generator.next();

      if (result.done) {
        finish();
        return;
      }

      lastStep = result.value;
    }

    if (!lastStep) return;

    applyVisualStep(mesh, lastStep);
  });
};