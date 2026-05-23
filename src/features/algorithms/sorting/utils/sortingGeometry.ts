// src/features/algorithms/sorting/utils/sortingGeometry.ts

import * as THREE from "three";

export const getSafeMaxValue = (values: number[]) => {
  if (values.length === 0) return 1;

  const max = Math.max(...values);

  return Number.isFinite(max) && max > 0 ? max : 1;
};

export const applyBarTransform = (
  object: THREE.Object3D,
  index: number,
  total: number,
  value: number,
  maxValue: number,
) => {
  const spacing = 1.15;
  const width = 0.75;
  const depth = 0.75;
  const maxHeight = 6;

  const height = Math.max(0.15, (value / maxValue) * maxHeight);
  const x = (index - (total - 1) / 2) * spacing;

  object.position.set(x, height / 2, 0);
  object.scale.set(width, height, depth);
  object.rotation.set(0, 0, 0);
  object.updateMatrix();
};