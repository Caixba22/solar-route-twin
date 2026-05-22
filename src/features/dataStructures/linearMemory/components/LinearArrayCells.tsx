// Ruta:
// src/features/dataStructures/linearMemory/components/LinearArrayCells.tsx

/**
 * LinearArrayCells
 *
 * Renderiza un array como celdas rectangulares instanciadas.
 *
 * Responsabilidad:
 * - Dibujar celdas del mismo tamaño.
 * - Mostrar valor e índice de cada posición.
 * - Mostrar etiquetas guía para que el usuario entienda qué fila es valor
 *   y qué fila representa índices.
 * - Exponer el InstancedMesh al runner mediante ref.
 *
 * Importante:
 * - Las transformaciones pesadas se aplican sobre InstancedMesh.
 * - Los colores vienen desde ALGO_THEME.
 * - No guarda estado React para animaciones.
 *
 * Corrección visual:
 * - Se crea una geometría base con vertex color blanco.
 * - Se inicializa cada instancia con ALGO_THEME.data.default.
 * - Esto evita que las celdas aparezcan negras antes de que el runner pinte
 *   los estados de ejecución.
 */

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

  /**
   * Color blanco como multiplicador neutral.
   *
   * Esto permite que instanceColor controle el color real
   * de cada celda sin oscurecerse.
   */
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

  /**
   * Exponemos el InstancedMesh real al runner.
   *
   * Así useLinearMemoryRunner puede pintar colores,
   * mover matrices y controlar las instancias sin estado React pesado.
   */
  useImperativeHandle(ref, () => meshRef.current as THREE.InstancedMesh);

  /**
   * Inicializa visualmente las celdas.
   *
   * Esto evita que se vean negras antes de que el runner aplique
   * el primer snapshot visual.
   */
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

  /**
   * Posición de las etiquetas laterales.
   *
   * Se colocan antes de la primera celda para explicar:
   * - VALOR: dato almacenado.
   * - ÍNDICE: posición dentro del array.
   */
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

      {/* Etiqueta de la fila de valores */}
      <Text
        position={[labelX, 1.23, 0.43]}
        fontSize={0.15}
        color={ALGO_THEME.data.boundary}
        anchorX="right"
        anchorY="middle"
      >
        VALOR
      </Text>

      {/* Etiqueta de la fila de índices */}
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
            {/* Valor almacenado en la celda */}
            <Text
              position={[0, 0.03, 0.43]}
              fontSize={0.28}
              color={ALGO_THEME.data.boundary}
              anchorX="center"
              anchorY="middle"
            >
              {value}
            </Text>

            {/* Índice de la celda */}
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