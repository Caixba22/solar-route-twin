// Ruta:
// src/features/dataStructures/linearMemory/scene/LinearMemoryScene.tsx

/**
 * LinearMemoryScene
 *
 * Escena 3D reutilizable para estructuras de memoria lineal.
 *
 * Por ahora renderiza:
 * - Array
 *
 * Después podrá reutilizarse para:
 * - Stack
 * - Queue
 * - Circular Queue
 *
 * Ajuste importante:
 * - Para arrays usamos OrthographicCamera porque mantiene las celdas legibles
 *   en móvil y evita que el modelo se vea demasiado lejos.
 * - El contenedor queda abierto al frente para que ninguna cara transparente
 *   tape o corte visualmente las celdas.
 */

import { useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, Text } from "@react-three/drei";
import * as THREE from "three";

import { ALGO_THEME } from "../../../../shared/constants/theme";

import type {
  LinearMemoryOperationConfig,
  LinearMemoryRuntimeSnapshot,
} from "../types/linearMemory.types";

import { LinearArrayCells } from "../components/LinearArrayCells";

import {
  useLinearMemoryRunner,
  type LinearMemoryStructureId,
} from "../runtime/useLinearMemoryRunner";

interface LinearMemorySceneProps {
  values: number[];
  structureId: LinearMemoryStructureId;
  operationConfig: LinearMemoryOperationConfig;
  onRuntimeSnapshotChange?: (
    snapshot: LinearMemoryRuntimeSnapshot,
  ) => void;
}

export const LinearMemoryScene = ({
  values,
  structureId,
  operationConfig,
  onRuntimeSnapshotChange,
}: LinearMemorySceneProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

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

  /**
   * Zoom responsive.
   *
   * En OrthographicCamera:
   * - mayor zoom = modelo más grande.
   * - menor zoom = modelo más lejano.
   *
   * Calculamos el zoom con base en el ancho disponible para que el array
   * quepa sin verse diminuto.
   */
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

  /**
   * Cámara más cercana visualmente, pero sin perspectiva extrema.
   */
  const cameraPosition = useMemo<[number, number, number]>(
    () => (isMobile ? [0, 4.4, 10] : [0, 4.2, 9]),
    [isMobile],
  );

  const cameraTarget = useMemo(
    () => new THREE.Vector3(0, isMobile ? 1.15 : 1.25, 0),
    [isMobile],
  );

  /**
   * Contenedor técnico abierto al frente.
   *
   * Quitamos la cara frontal para que no parezca que corta o tapa
   * los textos, punteros y celdas.
   */
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

  useLinearMemoryRunner(
    meshRef,
    currentPointerRef,
    foundPointerRef,
    values,
    structureId,
    operationConfig,
    onRuntimeSnapshotChange,
  );

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

      <LinearArrayCells ref={meshRef} values={values} />
    </>
  );
};