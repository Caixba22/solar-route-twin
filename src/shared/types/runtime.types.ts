// src/shared/types/runtime.types.ts

export type RuntimeStatus = "idle" | "running" | "paused" | "finished";

export type AlgoStepType =
  | "default"
  | "active"
  | "comparing"
  | "sorted"
  | "critical"
  | "pivot"
  | "boundary";


export type AlgoStepResult =
  | "visiting"
  | "comparing"
  | "found"
  | "not-found"
  | "accessed"
  | "finished";

export type AlgoStep = {
  type: AlgoStepType;
  activeIndices: number[];
  pivotIndices?: number[];
  boundaryIndices?: number[];
  comparingIndices?: number[];
  sortedIndices?: number[];
  result?: AlgoStepResult;
  description?: string;
  currentLabel?: string;
};