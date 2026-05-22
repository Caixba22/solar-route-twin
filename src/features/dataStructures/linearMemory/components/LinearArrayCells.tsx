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
 */

import { forwardRef, useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

import { ALGO_THEME } from "../../../../shared/constants/theme";
import { getLinearCellPosition } from "../utils/linearMemoryGeometry";

interface LinearArrayCellsProps {
  values: number[];
}

export const LinearArrayCells = forwardRef<
  THREE.InstancedMesh,
  LinearArrayCellsProps
>(({ values }, ref) => {
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
        ref={ref}
        args={[undefined, undefined, values.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />

        <meshStandardMaterial
          color={ALGO_THEME.data.default}
          vertexColors
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