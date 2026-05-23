// src/features/dataStructures/linearMemory/runtime/useGenericLinearMemoryRunner.ts

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
  CircularQueueMemoryOperationConfig,
  CircularQueueSlot,
  GenericLinearMemoryOperationConfig,
  LinearMemoryRuntimeSnapshot,
  LinearMemoryValue,
  QueueMemoryOperationConfig,
  StackMemoryOperationConfig,
} from "../types/linearMemory.types";

import type { GenericLinearMemoryStructureId } from "./linearMemoryRegistry";

import { createStackOperationGenerator } from "../logic/stackOperations";
import { createQueueOperationGenerator } from "../logic/queueOperations";
import { createCircularQueueOperationGenerator } from "../logic/circularQueueOperations";

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

const toNumberValues = (values: readonly LinearMemoryValue[]): number[] => {
  return values.filter((value): value is number => typeof value === "number");
};

const toCircularSlots = (
  values: readonly LinearMemoryValue[],
): CircularQueueSlot[] => {
  return values.map((value) => (typeof value === "number" ? value : null));
};

const getOperationLabel = (
  structureId: GenericLinearMemoryStructureId,
  operationConfig: GenericLinearMemoryOperationConfig,
): string => {
  if (structureId === "stack") {
    if (operationConfig.operationId === "push") return "Apilar valor";
    if (operationConfig.operationId === "pop") return "Desapilar valor";
    if (operationConfig.operationId === "peek") return "Consultar TOP";
    if (operationConfig.operationId === "is-empty") return "Verificar pila";

    return "Recorrer pila";
  }

  if (structureId === "queue") {
    if (operationConfig.operationId === "enqueue") return "Encolar valor";
    if (operationConfig.operationId === "dequeue") return "Desencolar valor";
    if (operationConfig.operationId === "front") return "Consultar FRONT";
    if (operationConfig.operationId === "rear") return "Consultar REAR";
    if (operationConfig.operationId === "is-empty") return "Verificar cola";

    return "Recorrer cola";
  }

  if (operationConfig.operationId === "enqueue") return "Encolar valor";
  if (operationConfig.operationId === "dequeue") return "Desencolar valor";
  if (operationConfig.operationId === "front") return "Consultar FRONT";
  if (operationConfig.operationId === "rear") return "Consultar REAR";
  if (operationConfig.operationId === "is-empty") return "Verificar cola";
  if (operationConfig.operationId === "is-full") return "Verificar capacidad";

  return "Recorrer cola circular";
};

const createIdleSnapshot = (
  structureId: GenericLinearMemoryStructureId,
  operationConfig: GenericLinearMemoryOperationConfig,
): LinearMemoryRuntimeSnapshot => {
  return {
    operationLabel: getOperationLabel(structureId, operationConfig),
    statusLabel: "En espera",
    description: "Presiona Play para ejecutar la operación seleccionada.",
    enqueueValue:
      "enqueueValue" in operationConfig
        ? operationConfig.enqueueValue
        : undefined,
    pushValue:
      "pushValue" in operationConfig ? operationConfig.pushValue : undefined,
    frontIndex:
      "frontIndex" in operationConfig ? operationConfig.frontIndex : undefined,
    rearIndex:
      "rearIndex" in operationConfig ? operationConfig.rearIndex : undefined,
    capacity:
      "capacity" in operationConfig ? operationConfig.capacity : undefined,
    size: "size" in operationConfig ? operationConfig.size : undefined,
    result: "visiting",
  };
};

const createSnapshotFromStep = (
  step: AlgoStep,
  values: readonly LinearMemoryValue[],
  structureId: GenericLinearMemoryStructureId,
  operationConfig: GenericLinearMemoryOperationConfig,
): LinearMemoryRuntimeSnapshot => {
  const activeIndex =
    step.activeIndices.length === 1 ? step.activeIndices[0] : undefined;

  const activeValue =
    activeIndex !== undefined && activeIndex >= 0 && activeIndex < values.length
      ? values[activeIndex]
      : undefined;

  return {
    operationLabel: getOperationLabel(structureId, operationConfig),
    statusLabel:
      step.result === "finished"
        ? "Finalizado"
        : step.currentLabel ?? "Paso actual",
    description: step.description ?? "Ejecutando visualización.",
    activeIndex,
    activeValue,
    enqueueValue:
      "enqueueValue" in operationConfig
        ? operationConfig.enqueueValue
        : undefined,
    pushValue:
      "pushValue" in operationConfig ? operationConfig.pushValue : undefined,
    topIndex:
      structureId === "stack" && values.length > 0
        ? values.length - 1
        : undefined,
    frontIndex:
      "frontIndex" in operationConfig ? operationConfig.frontIndex : undefined,
    rearIndex:
      "rearIndex" in operationConfig ? operationConfig.rearIndex : undefined,
    capacity:
      "capacity" in operationConfig ? operationConfig.capacity : undefined,
    size: "size" in operationConfig ? operationConfig.size : undefined,
    result: step.result,
  };
};

const createGenerator = (
  structureId: GenericLinearMemoryStructureId,
  values: readonly LinearMemoryValue[],
  operationConfig: GenericLinearMemoryOperationConfig,
): Generator<AlgoStep, void, unknown> => {
  if (structureId === "stack") {
    return createStackOperationGenerator(
      toNumberValues(values),
      operationConfig as StackMemoryOperationConfig,
    );
  }

  if (structureId === "queue") {
    return createQueueOperationGenerator(
      toNumberValues(values),
      operationConfig as QueueMemoryOperationConfig,
    );
  }

  return createCircularQueueOperationGenerator(
    toCircularSlots(values),
    operationConfig as CircularQueueMemoryOperationConfig,
  );
};

export const useGenericLinearMemoryRunner = (
  meshRef: RefObject<THREE.InstancedMesh | null>,
  currentPointerRef: RefObject<THREE.Group | null>,
  foundPointerRef: RefObject<THREE.Group | null>,
  values: readonly LinearMemoryValue[],
  structureId: GenericLinearMemoryStructureId,
  operationConfig: GenericLinearMemoryOperationConfig,
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
    visitedIndicesRef.current = new Set();
    timerRef.current = 0;

    generatorRef.current = createGenerator(
      structureId,
      values,
      operationConfig,
    );

    needsVisualResetRef.current = true;

    hidePointers(currentPointerRef, foundPointerRef);
    onRuntimeSnapshotChange?.(
      createIdleSnapshot(structureId, operationConfig),
    );
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
    if (step.activeIndices.length !== 1) {
      hidePointers(currentPointerRef, foundPointerRef);
      return;
    }

    const activeIndex = step.activeIndices[0];

    hidePointer(foundPointerRef);
    movePointer(currentPointerRef, activeIndex, total);
  };

  const applyVisualStep = (
    mesh: THREE.InstancedMesh,
    step: AlgoStep,
  ) => {
    const total = values.length;

    step.sortedIndices?.forEach((index) => {
      if (index >= 0 && index < total) {
        visitedIndicesRef.current.add(index);
      }
    });

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
      createSnapshotFromStep(
        step,
        values,
        structureId,
        operationConfig,
      ),
    );

    commitInstanceColors(mesh);
  };

  useEffect(() => {
    if (status !== "idle") return;

    resetInternalRuntime();
  }, [values, structureId, operationConfig, status]);

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

    ensureInstanceColorAttribute(mesh, values.length);

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

      if (result.done === true) {
        finish();
        return;
      }

      lastStep = result.value;
    }

    if (!lastStep) return;

    applyVisualStep(mesh, lastStep);
  });
};