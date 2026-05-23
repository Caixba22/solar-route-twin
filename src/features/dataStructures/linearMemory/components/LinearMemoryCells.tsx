// src/features/dataStructures/linearMemory/components/LinearMemoryCells.tsx

import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

import { ALGO_THEME } from "../../../../shared/constants/theme";
import {
  applyLinearCellTransform,
  getLinearCellPosition,
} from "../utils/linearMemoryGeometry";

export type LinearMemoryCellValue = number | null | undefined;

export type LinearMemoryCellMarker = {
  index: number;
  label: string;
  color?: string;
};

interface LinearMemoryCellsProps {
 
  values: readonly LinearMemoryCellValue[];

  valueLabel?: string;

  indexLabel?: string;

  showIndices?: boolean;

  showSideLabels?: boolean;

  emptyLabel?: string;

  markers?: readonly LinearMemoryCellMarker[];

  topIndex?: number;

  frontIndex?: number;

  rearIndex?: number;
}

const createLinearCellGeometry = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const positionAttribute = geometry.getAttribute("position");

  const vertexColors = new Float32Array(positionAttribute.count * 3);

  for (let index = 0; index < positionAttribute.count; index++) {
    const offset = index * 3;

    vertexColors[offset] = 1;
    vertexColors[offset + 1] = 1;
    vertexColors[offset + 2] = 1;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(vertexColors, 3));

  return geometry;
};

const forceMaterialUpdate = (mesh: THREE.InstancedMesh) => {
  const materials = Array.isArray(mesh.material)
    ? mesh.material
    : [mesh.material];

  materials.forEach((material) => {
    material.needsUpdate = true;
  });
};

const isValidCellIndex = (index: number, total: number): boolean => {
  return Number.isInteger(index) && index >= 0 && index < total;
};

const getDisplayValue = (
  value: LinearMemoryCellValue,
  emptyLabel: string,
): string => {
  if (value === null || value === undefined) return emptyLabel;

  return String(value);
};

const dummy = new THREE.Object3D();

export const LinearMemoryCells = forwardRef<
  THREE.InstancedMesh,
  LinearMemoryCellsProps
>(
  (
    {
      values,
      valueLabel = "VALOR",
      indexLabel = "POSICIÓN",
      showIndices = true,
      showSideLabels = true,
      emptyLabel = "—",
      markers = [],
      topIndex,
      frontIndex,
      rearIndex,
    },
    ref,
  ) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const geometry = useMemo(() => createLinearCellGeometry(), []);

    useImperativeHandle(ref, () => meshRef.current as THREE.InstancedMesh);

    useLayoutEffect(() => {
      const mesh = meshRef.current;

      if (!mesh) return;

      const total = values.length;
      const defaultColor = new THREE.Color(ALGO_THEME.data.default);

      mesh.count = total;

      for (let index = 0; index < total; index++) {
        applyLinearCellTransform(dummy, index, total);

        mesh.setMatrixAt(index, dummy.matrix);
        mesh.setColorAt(index, defaultColor);
      }

      mesh.instanceMatrix.needsUpdate = true;

      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }

      forceMaterialUpdate(mesh);
    }, [values.length]);

    const labelX = useMemo(() => {
      if (values.length === 0) return -1.5;

      const [firstCellX] = getLinearCellPosition(0, values.length);

      return firstCellX - 1.25;
    }, [values.length]);

    const resolvedMarkers = useMemo(() => {
      const automaticMarkers: LinearMemoryCellMarker[] = [];

      if (
        topIndex !== undefined &&
        isValidCellIndex(topIndex, values.length)
      ) {
        automaticMarkers.push({
          index: topIndex,
          label: "TOP",
          color: ALGO_THEME.data.active,
        });
      }

      if (
        frontIndex !== undefined &&
        isValidCellIndex(frontIndex, values.length)
      ) {
        automaticMarkers.push({
          index: frontIndex,
          label: "FRONT",
          color: ALGO_THEME.data.comparing,
        });
      }

      if (
        rearIndex !== undefined &&
        isValidCellIndex(rearIndex, values.length)
      ) {
        automaticMarkers.push({
          index: rearIndex,
          label: "REAR",
          color: ALGO_THEME.data.sorted,
        });
      }

      markers.forEach((marker) => {
        if (!isValidCellIndex(marker.index, values.length)) return;

        automaticMarkers.push({
          ...marker,
          color: marker.color ?? ALGO_THEME.data.boundary,
        });
      });

      return automaticMarkers;
    }, [frontIndex, markers, rearIndex, topIndex, values.length]);

    const markersByIndex = useMemo(() => {
      const map = new Map<number, LinearMemoryCellMarker[]>();

      resolvedMarkers.forEach((marker) => {
        const currentMarkers = map.get(marker.index) ?? [];

        currentMarkers.push(marker);
        map.set(marker.index, currentMarkers);
      });

      return map;
    }, [resolvedMarkers]);

    return (
      <group>
        <instancedMesh
          key={values.length}
          ref={meshRef}
          args={[geometry, undefined, values.length]}
          frustumCulled={false}
        >
          <meshStandardMaterial
            vertexColors
            toneMapped={false}
            roughness={0.28}
            metalness={0.12}
          />
        </instancedMesh>

        {showSideLabels && (
          <>
            <Text
              position={[labelX, 1.23, 0.43]}
              fontSize={0.15}
              color={ALGO_THEME.data.boundary}
              anchorX="right"
              anchorY="middle"
            >
              {valueLabel}
            </Text>

            {showIndices && (
              <Text
                position={[labelX, 0.48, 0.43]}
                fontSize={0.15}
                color={ALGO_THEME.data.comparing}
                anchorX="right"
                anchorY="middle"
              >
                {indexLabel}
              </Text>
            )}
          </>
        )}

        {values.map((value, index) => {
          const [x, y, z] = getLinearCellPosition(index, values.length);
          const cellMarkers = markersByIndex.get(index) ?? [];

          return (
            <group key={`${index}-${String(value)}`} position={[x, y, z]}>
              {cellMarkers.map((marker, markerIndex) => (
                <Text
                  key={`${marker.label}-${markerIndex}`}
                  position={[0, 0.72 + markerIndex * 0.25, 0.43]}
                  fontSize={0.13}
                  color={marker.color ?? ALGO_THEME.data.boundary}
                  anchorX="center"
                  anchorY="middle"
                >
                  {marker.label}
                </Text>
              ))}

              <Text
                position={[0, 0.03, 0.43]}
                fontSize={0.28}
                color={
                  value === null || value === undefined
                    ? ALGO_THEME.ui.textSecondary
                    : ALGO_THEME.data.boundary
                }
                anchorX="center"
                anchorY="middle"
              >
                {getDisplayValue(value, emptyLabel)}
              </Text>

              {showIndices && (
                <Text
                  position={[0, -0.72, 0.43]}
                  fontSize={0.16}
                  color={ALGO_THEME.data.comparing}
                  anchorX="center"
                  anchorY="middle"
                >
                  {index}
                </Text>
              )}
            </group>
          );
        })}
      </group>
    );
  },
);

LinearMemoryCells.displayName = "LinearMemoryCells";