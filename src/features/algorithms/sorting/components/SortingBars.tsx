// src/features/algorithms/sorting/components/SortingBars.tsx

import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";

import { ALGO_THEME } from "../../../../shared/constants/theme";
import {
  applyBarTransform,
  getSafeMaxValue,
} from "../utils/sortingGeometry";

export interface DataElement {
  value: number;
}

interface SortingBarsProps {
  data: DataElement[];
}

const dummy = new THREE.Object3D();

const createBarGeometry = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const positionAttribute = geometry.getAttribute("position");

  const vertexColors = new Float32Array(positionAttribute.count * 3);

  for (let index = 0; index < positionAttribute.count; index++) {
    const offset = index * 3;

    vertexColors[offset] = 1;
    vertexColors[offset + 1] = 1;
    vertexColors[offset + 2] = 1;
  }

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(vertexColors, 3),
  );

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

export const SortingBars = forwardRef<THREE.InstancedMesh, SortingBarsProps>(
  ({ data }, ref) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const geometry = useMemo(() => createBarGeometry(), []);

    useImperativeHandle(ref, () => meshRef.current as THREE.InstancedMesh);

    useLayoutEffect(() => {
      const mesh = meshRef.current;

      if (!mesh) return;

      const values = data.map((item) => item.value);
      const total = values.length;
      const maxValue = getSafeMaxValue(values);
      const defaultColor = new THREE.Color(ALGO_THEME.data.default);

      mesh.count = total;

      for (let index = 0; index < total; index++) {
        applyBarTransform(dummy, index, total, values[index], maxValue);

        mesh.setMatrixAt(index, dummy.matrix);
        mesh.setColorAt(index, defaultColor);
      }

      mesh.instanceMatrix.needsUpdate = true;

      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }

      forceMaterialUpdate(mesh);
    }, [data]);

    return (
      <instancedMesh
        key={data.length}
        ref={meshRef}
        args={[geometry, undefined, data.length]}
      >
        <meshStandardMaterial
          vertexColors
          toneMapped={false}
          roughness={0.45}
          metalness={0}
        />
      </instancedMesh>
    );
  },
);

SortingBars.displayName = "SortingBars";