// Ruta:
// src/features/dataStructures/linearMemory/scene/LinearMemoryScene.tsx

/**
 * LinearMemoryScene
 *
 * Escena 3D reutilizable para estructuras de memoria lineal.
 *
 * Rutas visuales:
 * - Array:
 *   - usa LinearArrayCells
 *   - usa useLinearMemoryRunner
 *
 * - Stack / Queue / Circular Queue:
 *   - usan LinearMemoryCells
 *   - usan useGenericLinearMemoryRunner
 *
 * Importante:
 * - No se llaman hooks condicionalmente.
 * - Cada ruta vive en su propio componente interno.
 * - Array queda intacto.
 */

import { useMemo, useRef, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, Text } from "@react-three/drei";
import * as THREE from "three";

import { ALGO_THEME } from "../../../../shared/constants/theme";

import type {
  AnyLinearMemoryOperationConfig,
  ArrayMemoryOperationConfig,
  CircularQueueMemoryOperationConfig,
  GenericLinearMemoryOperationConfig,
  LinearMemoryRuntimeSnapshot,
  LinearMemoryValue,
  QueueMemoryOperationConfig,
  StackMemoryOperationConfig,
} from "../types/linearMemory.types";

import {
  isArrayOperationId,
  isCircularQueueOperationId,
  isQueueOperationId,
  isStackOperationId,
} from "../types/linearMemory.types";

import { LinearArrayCells } from "../components/LinearArrayCells";
import { LinearMemoryCells } from "../components/LinearMemoryCells";

import { useLinearMemoryRunner } from "../runtime/useLinearMemoryRunner";
import { useGenericLinearMemoryRunner } from "../runtime/useGenericLinearMemoryRunner";

import type {
  ArrayLinearMemoryStructureId,
  GenericLinearMemoryStructureId,
  LinearMemoryStructureId,
} from "../runtime/linearMemoryRegistry";

import {
  isArrayLinearMemoryStructureId,
  isGenericLinearMemoryStructureId,
} from "../runtime/linearMemoryRegistry";

interface LinearMemorySceneProps {
  values: readonly LinearMemoryValue[];
  structureId: LinearMemoryStructureId;
  operationConfig: AnyLinearMemoryOperationConfig;
  onRuntimeSnapshotChange?: (
    snapshot: LinearMemoryRuntimeSnapshot,
  ) => void;
}

interface LinearMemoryContentProps {
  currentPointerRef: RefObject<THREE.Group | null>;
  foundPointerRef: RefObject<THREE.Group | null>;
  onRuntimeSnapshotChange?: (
    snapshot: LinearMemoryRuntimeSnapshot,
  ) => void;
}

interface ArrayLinearMemoryContentProps extends LinearMemoryContentProps {
  values: readonly LinearMemoryValue[];
  structureId: ArrayLinearMemoryStructureId;
  operationConfig: ArrayMemoryOperationConfig;
}

interface GenericLinearMemoryContentProps extends LinearMemoryContentProps {
  values: readonly LinearMemoryValue[];
  structureId: GenericLinearMemoryStructureId;
  operationConfig: GenericLinearMemoryOperationConfig;
}

const isArrayMemoryOperationConfig = (
  config: AnyLinearMemoryOperationConfig,
): config is ArrayMemoryOperationConfig => {
  return isArrayOperationId(config.operationId);
};

const isStackMemoryOperationConfig = (
  config: AnyLinearMemoryOperationConfig,
): config is StackMemoryOperationConfig => {
  return isStackOperationId(config.operationId) && "pushValue" in config;
};

const isQueueMemoryOperationConfig = (
  config: AnyLinearMemoryOperationConfig,
): config is QueueMemoryOperationConfig => {
  return isQueueOperationId(config.operationId) && "enqueueValue" in config;
};

const isCircularQueueMemoryOperationConfig = (
  config: AnyLinearMemoryOperationConfig,
): config is CircularQueueMemoryOperationConfig => {
  return (
    isCircularQueueOperationId(config.operationId) &&
    "enqueueValue" in config &&
    "capacity" in config &&
    "frontIndex" in config &&
    "rearIndex" in config &&
    "size" in config
  );
};

const isGenericOperationConfigForStructure = (
  structureId: GenericLinearMemoryStructureId,
  config: AnyLinearMemoryOperationConfig,
): config is GenericLinearMemoryOperationConfig => {
  if (structureId === "stack") {
    return isStackMemoryOperationConfig(config);
  }

  if (structureId === "queue") {
    return isQueueMemoryOperationConfig(config);
  }

  return isCircularQueueMemoryOperationConfig(config);
};

const ArrayLinearMemoryContent = ({
  values,
  structureId,
  operationConfig,
  currentPointerRef,
  foundPointerRef,
  onRuntimeSnapshotChange,
}: ArrayLinearMemoryContentProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const arrayValues = useMemo(
    () => values.filter((value): value is number => typeof value === "number"),
    [values],
  );

  useLinearMemoryRunner(
    meshRef,
    currentPointerRef,
    foundPointerRef,
    arrayValues,
    structureId,
    operationConfig,
    onRuntimeSnapshotChange,
  );

  return <LinearArrayCells ref={meshRef} values={arrayValues} />;
};

const GenericLinearMemoryContent = ({
  values,
  structureId,
  operationConfig,
  currentPointerRef,
  foundPointerRef,
  onRuntimeSnapshotChange,
}: GenericLinearMemoryContentProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const genericValues = useMemo(() => [...values], [values]);

  useGenericLinearMemoryRunner(
    meshRef,
    currentPointerRef,
    foundPointerRef,
    genericValues,
    structureId,
    operationConfig,
    onRuntimeSnapshotChange,
  );

  const cellConfig = useMemo(() => {
    if (structureId === "stack") {
      return {
        valueLabel: "DATO",
        indexLabel: "POSICIÓN",
        emptyLabel: "—",
        topIndex:
          genericValues.length > 0 ? genericValues.length - 1 : undefined,
        frontIndex: undefined,
        rearIndex: undefined,
      };
    }

    if (structureId === "queue") {
      return {
        valueLabel: "DATO",
        indexLabel: "POSICIÓN",
        emptyLabel: "—",
        topIndex: undefined,
        frontIndex: genericValues.length > 0 ? 0 : undefined,
        rearIndex:
          genericValues.length > 0 ? genericValues.length - 1 : undefined,
      };
    }

    return {
      valueLabel: "DATO",
      indexLabel: "SLOT",
      emptyLabel: "vacío",
      topIndex: undefined,
      frontIndex:
        "size" in operationConfig && operationConfig.size > 0
          ? operationConfig.frontIndex
          : undefined,
      rearIndex:
        "size" in operationConfig &&
        operationConfig.size > 0 &&
        operationConfig.rearIndex >= 0
          ? operationConfig.rearIndex
          : undefined,
    };
  }, [genericValues.length, operationConfig, structureId]);

  return (
    <LinearMemoryCells
      ref={meshRef}
      values={genericValues}
      valueLabel={cellConfig.valueLabel}
      indexLabel={cellConfig.indexLabel}
      emptyLabel={cellConfig.emptyLabel}
      topIndex={cellConfig.topIndex}
      frontIndex={cellConfig.frontIndex}
      rearIndex={cellConfig.rearIndex}
    />
  );
};

export const LinearMemoryScene = ({
  values,
  structureId,
  operationConfig,
  onRuntimeSnapshotChange,
}: LinearMemorySceneProps) => {
  const currentPointerRef = useRef<THREE.Group>(null);
  const foundPointerRef = useRef<THREE.Group>(null);

  const canvasWidth = useThree((state) => state.size.width);

  const isMobile = canvasWidth < 640;
  const isTablet = canvasWidth >= 640 && canvasWidth < 1024;

  const containerWidth = useMemo(
    () => Math.max(12, values.length * 1.25 + 3),
    [values.length],
  );

  const containerHeight = isMobile ? 5.2 : 5.4;
  const containerDepth = isMobile ? 2.7 : 3.2;
  const wallThickness = 0.06;
  const containerCenterY = containerHeight / 2;

  const cameraZoom = useMemo(() => {
    const horizontalMargin = isMobile ? 2.4 : 3.2;
    const zoomByWidth = canvasWidth / (containerWidth + horizontalMargin);

    if (isMobile) {
      return Math.min(Math.max(zoomByWidth, 22), 30);
    }

    if (isTablet) {
      return Math.min(Math.max(zoomByWidth, 34), 48);
    }

    return Math.min(Math.max(zoomByWidth, 52), 72);
  }, [canvasWidth, containerWidth, isMobile, isTablet]);

  const cameraPosition = useMemo<[number, number, number]>(
    () => (isMobile ? [0, 4.4, 10] : [0, 4.2, 9]),
    [isMobile],
  );

  const cameraTarget = useMemo(
    () => new THREE.Vector3(0, isMobile ? 1.15 : 1.25, 0),
    [isMobile],
  );

  const containerPanels = useMemo(
    () =>
      [
        {
          key: "back",
          position: [0, 0, -containerDepth / 2] as [number, number, number],
          size: [containerWidth, containerHeight, wallThickness] as [
            number,
            number,
            number,
          ],
          opacity: 0.1,
        },
        {
          key: "left",
          position: [-containerWidth / 2, 0, 0] as [number, number, number],
          size: [wallThickness, containerHeight, containerDepth] as [
            number,
            number,
            number,
          ],
          opacity: 0.1,
        },
        {
          key: "right",
          position: [containerWidth / 2, 0, 0] as [number, number, number],
          size: [wallThickness, containerHeight, containerDepth] as [
            number,
            number,
            number,
          ],
          opacity: 0.1,
        },
        {
          key: "top",
          position: [0, containerHeight / 2, 0] as [number, number, number],
          size: [containerWidth, wallThickness, containerDepth] as [
            number,
            number,
            number,
          ],
          opacity: 0.07,
        },
        {
          key: "bottom",
          position: [0, -containerHeight / 2, 0] as [number, number, number],
          size: [containerWidth, wallThickness, containerDepth] as [
            number,
            number,
            number,
          ],
          opacity: 0.13,
        },
      ] as const,
    [containerWidth, containerHeight, containerDepth],
  );

  const renderLinearMemoryContent = () => {
    if (
      isArrayLinearMemoryStructureId(structureId) &&
      isArrayMemoryOperationConfig(operationConfig)
    ) {
      return (
        <ArrayLinearMemoryContent
          values={values}
          structureId={structureId}
          operationConfig={operationConfig}
          currentPointerRef={currentPointerRef}
          foundPointerRef={foundPointerRef}
          onRuntimeSnapshotChange={onRuntimeSnapshotChange}
        />
      );
    }

    if (
      isGenericLinearMemoryStructureId(structureId) &&
      isGenericOperationConfigForStructure(structureId, operationConfig)
    ) {
      return (
        <GenericLinearMemoryContent
          values={values}
          structureId={structureId}
          operationConfig={operationConfig}
          currentPointerRef={currentPointerRef}
          foundPointerRef={foundPointerRef}
          onRuntimeSnapshotChange={onRuntimeSnapshotChange}
        />
      );
    }

    return (
      <Text
        position={[0, 1.4, 0.45]}
        fontSize={isMobile ? 0.18 : 0.22}
        color={ALGO_THEME.data.critical}
        anchorX="center"
        anchorY="middle"
      >
        Configuración incompatible con la estructura seleccionada
      </Text>
    );
  };

  return (
    <>
      <color attach="background" args={[ALGO_THEME.scene.background]} />

      <OrthographicCamera
        makeDefault
        position={cameraPosition}
        zoom={cameraZoom}
        near={0.1}
        far={100}
      />

      <OrbitControls
        makeDefault
        enableDamping
        enablePan={false}
        target={cameraTarget}
        minZoom={isMobile ? 18 : 36}
        maxZoom={isMobile ? 44 : 90}
      />

      <ambientLight intensity={0.72} />
      <pointLight position={[7, 7, 7]} intensity={16} />
      <pointLight position={[-5, 4, 4]} intensity={7} />

      <group position={[0, containerCenterY, 0]}>
        {containerPanels.map((panel) => (
          <mesh key={panel.key} position={panel.position}>
            <boxGeometry args={panel.size} />

            <meshStandardMaterial
              color={ALGO_THEME.scene.sortingBackdrop}
              transparent
              opacity={panel.opacity}
              roughness={0.18}
              metalness={0.06}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}

        <lineSegments>
          <edgesGeometry
            args={[
              new THREE.BoxGeometry(
                containerWidth,
                containerHeight,
                containerDepth,
              ),
            ]}
          />

          <lineBasicMaterial
            color={ALGO_THEME.scene.sortingBackdropBorder}
            transparent
            opacity={0.13}
          />
        </lineSegments>
      </group>

      <group ref={currentPointerRef} visible={false}>
        <Text
          position={[0, 0.45, 0]}
          fontSize={isMobile ? 0.15 : 0.18}
          color={ALGO_THEME.data.active}
          anchorX="center"
          anchorY="middle"
        >
          CURRENT
        </Text>

        <mesh rotation={[Math.PI, 0, Math.PI / 4]}>
          <coneGeometry args={[0.22, 0.5, 4]} />

          <meshStandardMaterial
            color={ALGO_THEME.data.active}
            emissive={ALGO_THEME.data.active}
            emissiveIntensity={0.55}
            roughness={0.2}
            metalness={0.2}
          />
        </mesh>
      </group>

      <group ref={foundPointerRef} visible={false}>
        <Text
          position={[0, 0.58, 0]}
          fontSize={isMobile ? 0.17 : 0.2}
          color={ALGO_THEME.data.sorted}
          anchorX="center"
          anchorY="middle"
        >
          FOUND
        </Text>

        <mesh rotation={[Math.PI, 0, Math.PI / 4]}>
          <coneGeometry args={[0.28, 0.58, 4]} />

          <meshStandardMaterial
            color={ALGO_THEME.data.sorted}
            emissive={ALGO_THEME.data.sorted}
            emissiveIntensity={0.75}
            roughness={0.18}
            metalness={0.25}
          />
        </mesh>

        <mesh position={[0, -0.08, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.035, 8, 32]} />

          <meshStandardMaterial
            color={ALGO_THEME.data.sorted}
            emissive={ALGO_THEME.data.sorted}
            emissiveIntensity={0.55}
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>
      </group>

      {renderLinearMemoryContent()}
    </>
  );
};