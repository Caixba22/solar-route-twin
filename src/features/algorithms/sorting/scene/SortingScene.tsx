// Ruta:
// src/features/algorithms/sorting/scene/SortingScene.tsx

/**
 * SortingScene
 *
 * Escena 3D reutilizable para algoritmos de ordenamiento.
 * Monta cámara, controles, luces, contenedor visual cerrado y barras instanciadas.
 *
 * Responsabilidad:
 * - Preparar el espacio 3D común para ordenamientos.
 * - Renderizar un contenedor tipo cristal técnico cerrado en sus 6 caras.
 * - Renderizar las barras dentro del contenedor.
 *
 * Importante:
 * - Los colores vienen desde ALGO_THEME.
 * - No se hardcodean colores en la escena.
 * - El contenedor vive aquí porque será reutilizado por todos los ordenamientos.
 * - useSortingRunner sigue encargado solo de ejecutar y pintar las barras.
 */

import { useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

import {
  SortingBars,
  type DataElement,
} from "../components/SortingBars";

import { useSortingRunner } from "../runtime/useSortingRunner";
import { ALGO_THEME } from "../../../../shared/constants/theme";

interface SortingSceneProps {
  data: DataElement[];
  rawArray: number[];
}

export const SortingScene = ({ data, rawArray }: SortingSceneProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const canvasWidth = useThree((state) => state.size.width);

  const isMobile = canvasWidth < 640;

  const cameraPosition = useMemo<[number, number, number]>(
    () => (isMobile ? [0, 3.4, 50] : [0, 3.2, 18]),
    [isMobile],
  );

  const cameraTarget = useMemo(() => new THREE.Vector3(0, 3, 0), []);

  const cameraFov = isMobile ? 52 : 46;

  /**
   * Medidas del contenedor.
   * Se adaptan a la cantidad de barras para que pueda reutilizarse
   * con otros algoritmos de ordenamiento.
   */
  const containerWidth = useMemo(
    () => Math.max(14, rawArray.length * 1.15 + 3),
    [rawArray.length],
  );

  const containerHeight = isMobile ? 9 : 8;
  const containerDepth = 3;
  const wallThickness = 0.06;

  /**
   * El grupo del contenedor se centra visualmente para que:
   * - su base quede cerca de y=0
   * - las barras vivan dentro del volumen
   */
  const containerCenterY = containerHeight / 2;

  useSortingRunner(meshRef, rawArray);

  return (
    <>
      {/* Fondo general del Canvas */}
      <color
        attach="background"
        args={[ALGO_THEME.scene.background]}
      />

      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />

      <OrbitControls
        makeDefault
        enableDamping
        target={cameraTarget}
      />

      <ambientLight intensity={0.6} />
      <pointLight position={[8, 8, 8]} intensity={24} />
      <pointLight position={[-6, 5, 4]} intensity={10} />

      {/* Contenedor tipo cristal técnico cerrado en las 6 caras */}
      <group position={[0, containerCenterY, 0]}>
        {/* Cara trasera */}
        <mesh position={[0, 0, -containerDepth / 2]}>
          <boxGeometry
            args={[
              containerWidth,
              containerHeight,
              wallThickness,
            ]}
          />
          <meshStandardMaterial
            color={ALGO_THEME.scene.sortingBackdrop}
            transparent
            opacity={0.10}
            roughness={0.2}
            metalness={0.08}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Cara frontal */}
        <mesh position={[0, 0, containerDepth / 2]}>
          <boxGeometry
            args={[
              containerWidth,
              containerHeight,
              wallThickness,
            ]}
          />
          <meshStandardMaterial
            color={ALGO_THEME.scene.sortingBackdrop}
            transparent
            opacity={0.10}
            roughness={0.12}
            metalness={0.04}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Cara izquierda */}
        <mesh position={[-containerWidth / 2, 0, 0]}>
          <boxGeometry
            args={[
              wallThickness,
              containerHeight,
              containerDepth,
            ]}
          />
          <meshStandardMaterial
            color={ALGO_THEME.scene.sortingBackdrop}
            transparent
            opacity={0.10}
            roughness={0.18}
            metalness={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Cara derecha */}
        <mesh position={[containerWidth / 2, 0, 0]}>
          <boxGeometry
            args={[
              wallThickness,
              containerHeight,
              containerDepth,
            ]}
          />
          <meshStandardMaterial
            color={ALGO_THEME.scene.sortingBackdrop}
            transparent
            opacity={0.10}
            roughness={0.18}
            metalness={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Cara superior */}
        <mesh position={[0, containerHeight / 2, 0]}>
          <boxGeometry
            args={[
              containerWidth,
              wallThickness,
              containerDepth,
            ]}
          />
          <meshStandardMaterial
            color={ALGO_THEME.scene.sortingBackdrop}
            transparent
            opacity={0.10}
            roughness={0.14}
            metalness={0.04}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Cara inferior */}
        <mesh position={[0, -containerHeight / 2, 0]}>
          <boxGeometry
            args={[
              containerWidth,
              wallThickness,
              containerDepth,
            ]}
          />
          <meshStandardMaterial
            color={ALGO_THEME.scene.sortingBackdrop}
            transparent
            opacity={0.15}
            roughness={0.22}
            metalness={0.06}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Borde exterior del contenedor completo */}
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
            opacity={0.10}
          />
        </lineSegments>
      </group>

      {/* Barras del algoritmo */}
      <SortingBars ref={meshRef} data={data} />
    </>
  );
};