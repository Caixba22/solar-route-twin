// src/features/dataStructures/linearMemory/types/linearMemory.types.ts

import type { AlgoStepResult } from "../../../../shared/types/runtime.types";
export type LinearMemoryValue = number | null;
export const ARRAY_OPERATION_IDS = [
  "traverse",
  "search",
  "access",
  "update",
  "push",
  "insert",
  "delete",
] as const;

export type ArrayOperationId = (typeof ARRAY_OPERATION_IDS)[number];

export type ArrayMemoryOperationConfig = {
  operationId: ArrayOperationId;

  searchTarget: number;
  accessIndex: number;

  updateIndex: number;
  updateValue: number;

  pushValue: number;

  insertIndex: number;
  insertValue: number;

  deleteIndex: number;
};

export type LinearMemoryOperationConfig = ArrayMemoryOperationConfig;

export const STACK_OPERATION_IDS = [
  "traverse",
  "push",
  "pop",
  "peek",
  "is-empty",
] as const;

export type StackOperationId = (typeof STACK_OPERATION_IDS)[number];

export type StackMemoryOperationConfig = {
  operationId: StackOperationId;

  pushValue: number;
};

export const QUEUE_OPERATION_IDS = [
  "traverse",
  "enqueue",
  "dequeue",
  "front",
  "rear",
  "is-empty",
] as const;

export type QueueOperationId = (typeof QUEUE_OPERATION_IDS)[number];

export type QueueMemoryOperationConfig = {
  operationId: QueueOperationId;

  enqueueValue: number;
};

export type CircularQueueSlot = number | null;

export const CIRCULAR_QUEUE_OPERATION_IDS = [
  "traverse",
  "enqueue",
  "dequeue",
  "front",
  "rear",
  "is-empty",
  "is-full",
] as const;

export type CircularQueueOperationId =
  (typeof CIRCULAR_QUEUE_OPERATION_IDS)[number];

export type CircularQueueMemoryOperationConfig = {
  operationId: CircularQueueOperationId;

  enqueueValue: number;
  capacity: number;
  frontIndex: number;
  rearIndex: number;
  size: number;
};

export type GenericLinearMemoryOperationConfig =
  | StackMemoryOperationConfig
  | QueueMemoryOperationConfig
  | CircularQueueMemoryOperationConfig;

export type AnyLinearMemoryOperationConfig =
  | ArrayMemoryOperationConfig
  | GenericLinearMemoryOperationConfig;

export type LinearMemoryRuntimeSnapshot = {
  operationLabel: string;
  statusLabel: string;
  description: string;

  activeIndex?: number;
  activeValue?: number | null;

  targetValue?: number;

  accessIndex?: number;

  updateIndex?: number;
  updateValue?: number;
  previousValue?: number | null;

  pushValue?: number;

  insertIndex?: number;
  insertValue?: number;

  deleteIndex?: number;

  enqueueValue?: number;

  topIndex?: number;
  frontIndex?: number;
  rearIndex?: number;

  capacity?: number;
  size?: number;

  result?: AlgoStepResult;
};

export const isArrayOperationId = (
  value: string,
): value is ArrayOperationId => {
  return ARRAY_OPERATION_IDS.includes(value as ArrayOperationId);
};

export const isStackOperationId = (
  value: string,
): value is StackOperationId => {
  return STACK_OPERATION_IDS.includes(value as StackOperationId);
};

export const isQueueOperationId = (
  value: string,
): value is QueueOperationId => {
  return QUEUE_OPERATION_IDS.includes(value as QueueOperationId);
};

export const isCircularQueueOperationId = (
  value: string,
): value is CircularQueueOperationId => {
  return CIRCULAR_QUEUE_OPERATION_IDS.includes(
    value as CircularQueueOperationId,
  );
};