// src/features/dataStructures/linearMemory/components/LinearArrayCells.tsx

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

interface LinearArrayCellsProps {
  values: number[];
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

const dummy = new THREE.Object3D();

export const LinearArrayCells = forwardRef<
  THREE.InstancedMesh,
  LinearArrayCellsProps
>(({ values }, ref) => {
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

      <Text
        position={[labelX, 1.23, 0.43]}
        fontSize={0.15}
        color={ALGO_THEME.data.boundary}
        anchorX="right"
        anchorY="middle"
      >
        VALOR
      </Text>

      <Text
        position={[labelX, 0.48, 0.43]}
        fontSize={0.15}
        color={ALGO_THEME.data.comparing}
        anchorX="right"
        anchorY="middle"
      >
        ÍNDICE
      </Text>

      {values.map((value, index) => {
        const [x, y, z] = getLinearCellPosition(index, values.length);

        return (
          <group key={`${index}-${value}`} position={[x, y, z]}>
            <Text
              position={[0, 0.03, 0.43]}
              fontSize={0.28}
              color={ALGO_THEME.data.boundary}
              anchorX="center"
              anchorY="middle"
            >
              {value}
            </Text>

            <Text
              position={[0, -0.72, 0.43]}
              fontSize={0.16}
              color={ALGO_THEME.data.comparing}
              anchorX="center"
              anchorY="middle"
            >
              {index}
            </Text>
          </group>
        );
      })}
    </group>
  );
});

LinearArrayCells.displayName = "LinearArrayCells";