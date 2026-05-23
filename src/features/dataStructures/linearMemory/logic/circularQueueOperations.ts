// src/features/dataStructures/linearMemory/logic/circularQueueOperations.ts

import type { AlgoStep } from "../../../../shared/types/runtime.types";

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

export type CircularQueueOperationConfig = {
  operationId: CircularQueueOperationId;

  enqueueValue: number;
  capacity?: number;
  frontIndex?: number;
  rearIndex?: number;

  size?: number;
};

type CircularQueueState = {
  slots: CircularQueueSlot[];
  capacity: number;
  size: number;
  frontIndex: number;
  rearIndex: number;
};

const isFilledSlot = (value: CircularQueueSlot): value is number => {
  return value !== null;
};

const createIndexRange = (endExclusive: number): number[] => {
  return Array.from({ length: endExclusive }, (_, index) => index);
};

const uniqueValidIndices = (
  indices: number[],
  capacity: number,
): number[] => {
  return Array.from(
    new Set(indices.filter((index) => index >= 0 && index < capacity)),
  );
};

const normalizeCircularIndex = (index: number, capacity: number): number => {
  if (capacity <= 0) return 0;

  return ((index % capacity) + capacity) % capacity;
};

const getFirstFilledIndex = (slots: CircularQueueSlot[]): number => {
  const foundIndex = slots.findIndex(isFilledSlot);

  return foundIndex >= 0 ? foundIndex : 0;
};

const getRearIndexFromFrontAndSize = (
  frontIndex: number,
  size: number,
  capacity: number,
): number => {
  if (capacity <= 0 || size <= 0) return -1;

  return normalizeCircularIndex(frontIndex + size - 1, capacity);
};

const normalizeCircularQueueState = (
  values: CircularQueueSlot[],
  config: CircularQueueOperationConfig,
): CircularQueueState => {
  const capacity = Math.max(config.capacity ?? values.length, 0);

  const slots = Array.from({ length: capacity }, (_, index) => {
    return values[index] ?? null;
  });

  const calculatedSize = slots.filter(isFilledSlot).length;
  const size = Math.max(
    0,
    Math.min(config.size ?? calculatedSize, capacity),
  );

  const frontIndex =
    size > 0
      ? normalizeCircularIndex(
          config.frontIndex ?? getFirstFilledIndex(slots),
          capacity,
        )
      : normalizeCircularIndex(config.frontIndex ?? 0, capacity || 1);

  const rearIndex =
    size > 0
      ? normalizeCircularIndex(
          config.rearIndex ??
            getRearIndexFromFrontAndSize(frontIndex, size, capacity),
          capacity,
        )
      : -1;

  return {
    slots,
    capacity,
    size,
    frontIndex,
    rearIndex,
  };
};

const getCircularQueueBoundaries = (
  state: CircularQueueState,
): number[] => {
  if (state.capacity === 0) return [];

  return uniqueValidIndices(
    [0, state.capacity - 1, state.frontIndex, state.rearIndex],
    state.capacity,
  );
};

const getLogicalQueueIndices = (state: CircularQueueState): number[] => {
  if (state.capacity === 0 || state.size === 0) return [];

  return Array.from({ length: state.size }, (_, offset) =>
    normalizeCircularIndex(state.frontIndex + offset, state.capacity),
  );
};

const formatSlotValue = (value: CircularQueueSlot): string => {
  return value === null ? "vacío" : String(value);
};

function* circularQueueTraversalGenerator(
  values: CircularQueueSlot[],
  config: CircularQueueOperationConfig,
): Generator<AlgoStep, void, unknown> {
  const state = normalizeCircularQueueState(values, config);

  if (state.capacity === 0 || state.size === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "La cola circular está vacía. No hay elementos para recorrer.",
    };

    return;
  }

  const boundaryIndices = getCircularQueueBoundaries(state);
  const logicalIndices = getLogicalQueueIndices(state);
  const visitedIndices: number[] = [];

  for (const index of logicalIndices) {
    const currentValue = state.slots[index];

    yield {
      type: "active",
      activeIndices: [index],
      boundaryIndices,
      sortedIndices: [...visitedIndices],
      result: "visiting",
      currentLabel:
        index === state.frontIndex
          ? "FRONT"
          : index === state.rearIndex
            ? "REAR"
            : "QUEUE",
      description: `Recorriendo en orden FIFO. Índice físico: ${index}. Valor: ${formatSlotValue(
        currentValue,
      )}.`,
    };

    visitedIndices.push(index);
  }

  yield {
    type: "sorted",
    activeIndices: [],
    boundaryIndices,
    sortedIndices: logicalIndices,
    result: "finished",
    currentLabel: "DONE",
    description:
      "Recorrido terminado. Se visitaron los elementos desde FRONT hasta REAR usando lógica circular.",
  };
}

function* circularQueueEnqueueGenerator(
  values: CircularQueueSlot[],
  config: CircularQueueOperationConfig,
): Generator<AlgoStep, void, unknown> {
  const state = normalizeCircularQueueState(values, config);
  const boundaryIndices = getCircularQueueBoundaries(state);

  if (state.capacity === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "NO CAPACITY",
      description:
        "No se puede hacer enqueue porque la cola circular no tiene capacidad definida.",
    };

    return;
  }

  if (state.size >= state.capacity) {
    yield {
      type: "critical",
      activeIndices: createIndexRange(state.capacity),
      boundaryIndices,
      result: "finished",
      currentLabel: "FULL",
      description:
        "No se puede hacer enqueue porque la cola circular está llena.",
    };

    return;
  }

  const nextRearIndex =
    state.size === 0
      ? state.frontIndex
      : normalizeCircularIndex(state.rearIndex + 1, state.capacity);

  if (state.size > 0) {
    yield {
      type: "boundary",
      activeIndices: [state.frontIndex, state.rearIndex],
      boundaryIndices,
      result: "visiting",
      currentLabel: "FRONT / REAR",
      description: `Estado actual: FRONT está en ${state.frontIndex} y REAR está en ${state.rearIndex}.`,
    };
  }

  yield {
    type: "active",
    activeIndices: [nextRearIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "ENQUEUE",
    description:
      nextRearIndex === 0 && state.rearIndex === state.capacity - 1
        ? `REAR llegó al final y vuelve al índice 0. Se insertará ${config.enqueueValue} en el índice ${nextRearIndex}.`
        : `El valor ${config.enqueueValue} se insertará en el índice ${nextRearIndex}.`,
  };

  yield {
    type: "sorted",
    activeIndices: [nextRearIndex],
    boundaryIndices: uniqueValidIndices(
      [state.frontIndex, nextRearIndex],
      state.capacity,
    ),
    sortedIndices: [nextRearIndex],
    result: "finished",
    currentLabel: "ENQUEUED",
    description: `Operación enqueue terminada. ${config.enqueueValue} quedó como nuevo REAR.`,
  };
}

function* circularQueueDequeueGenerator(
  values: CircularQueueSlot[],
  config: CircularQueueOperationConfig,
): Generator<AlgoStep, void, unknown> {
  const state = normalizeCircularQueueState(values, config);
  const boundaryIndices = getCircularQueueBoundaries(state);

  if (state.capacity === 0 || state.size === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description:
        "No se puede hacer dequeue porque la cola circular está vacía.",
    };

    return;
  }

  const removedValue = state.slots[state.frontIndex];
  const nextFrontIndex =
    state.size > 1
      ? normalizeCircularIndex(state.frontIndex + 1, state.capacity)
      : state.frontIndex;

  yield {
    type: "critical",
    activeIndices: [state.frontIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "DEQUEUE",
    description: `dequeue() retira el FRONT. Índice: ${
      state.frontIndex
    }. Valor a retirar: ${formatSlotValue(removedValue)}.`,
  };

  if (state.size > 1) {
    yield {
      type: "active",
      activeIndices: [nextFrontIndex],
      boundaryIndices: uniqueValidIndices(
        [nextFrontIndex, state.rearIndex],
        state.capacity,
      ),
      result: "accessed",
      currentLabel: "NEW FRONT",
      description:
        nextFrontIndex === 0 && state.frontIndex === state.capacity - 1
          ? `FRONT llegó al final y vuelve al índice 0. Nuevo FRONT: ${nextFrontIndex}.`
          : `El siguiente elemento pasa a ser FRONT. Nuevo FRONT: ${nextFrontIndex}.`,
    };
  }

  yield {
    type: "sorted",
    activeIndices: state.size > 1 ? [nextFrontIndex] : [],
    boundaryIndices:
      state.size > 1
        ? uniqueValidIndices([nextFrontIndex, state.rearIndex], state.capacity)
        : [],
    sortedIndices:
      state.size > 1
        ? getLogicalQueueIndices({
            ...state,
            frontIndex: nextFrontIndex,
            size: state.size - 1,
          })
        : [],
    result: "finished",
    currentLabel: "DEQUEUED",
    description:
      state.size > 1
        ? `Operación dequeue terminada. Se retiró ${formatSlotValue(
            removedValue,
          )}. La cola conserva el orden FIFO.`
        : `Operación dequeue terminada. Se retiró ${formatSlotValue(
            removedValue,
          )}. La cola quedó vacía.`,
  };
}

function* circularQueueFrontGenerator(
  values: CircularQueueSlot[],
  config: CircularQueueOperationConfig,
): Generator<AlgoStep, void, unknown> {
  const state = normalizeCircularQueueState(values, config);

  if (state.capacity === 0 || state.size === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "No se puede consultar FRONT porque la cola está vacía.",
    };

    return;
  }

  yield {
    type: "active",
    activeIndices: [state.frontIndex],
    boundaryIndices: getCircularQueueBoundaries(state),
    result: "accessed",
    currentLabel: "FRONT",
    description: `front() consulta el primer elemento sin retirarlo. Índice: ${
      state.frontIndex
    }. Valor: ${formatSlotValue(state.slots[state.frontIndex])}.`,
  };
}

function* circularQueueRearGenerator(
  values: CircularQueueSlot[],
  config: CircularQueueOperationConfig,
): Generator<AlgoStep, void, unknown> {
  const state = normalizeCircularQueueState(values, config);

  if (state.capacity === 0 || state.size === 0 || state.rearIndex < 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "No se puede consultar REAR porque la cola está vacía.",
    };

    return;
  }

  yield {
    type: "active",
    activeIndices: [state.rearIndex],
    boundaryIndices: getCircularQueueBoundaries(state),
    result: "accessed",
    currentLabel: "REAR",
    description: `rear() consulta el último elemento sin retirarlo. Índice: ${
      state.rearIndex
    }. Valor: ${formatSlotValue(state.slots[state.rearIndex])}.`,
  };
}

function* circularQueueIsEmptyGenerator(
  values: CircularQueueSlot[],
  config: CircularQueueOperationConfig,
): Generator<AlgoStep, void, unknown> {
  const state = normalizeCircularQueueState(values, config);

  if (state.size === 0) {
    yield {
      type: "sorted",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "isEmpty() devuelve true. La cola circular está vacía.",
    };

    return;
  }

  yield {
    type: "boundary",
    activeIndices: uniqueValidIndices(
      [state.frontIndex, state.rearIndex],
      state.capacity,
    ),
    boundaryIndices: getCircularQueueBoundaries(state),
    result: "accessed",
    currentLabel: "NOT EMPTY",
    description: `isEmpty() devuelve false. La cola circular tiene ${state.size} elemento(s).`,
  };
}

function* circularQueueIsFullGenerator(
  values: CircularQueueSlot[],
  config: CircularQueueOperationConfig,
): Generator<AlgoStep, void, unknown> {
  const state = normalizeCircularQueueState(values, config);

  if (state.capacity > 0 && state.size >= state.capacity) {
    yield {
      type: "critical",
      activeIndices: createIndexRange(state.capacity),
      boundaryIndices: getCircularQueueBoundaries(state),
      result: "finished",
      currentLabel: "FULL",
      description: "isFull() devuelve true. La cola circular está llena.",
    };

    return;
  }

  yield {
    type: "boundary",
    activeIndices: uniqueValidIndices(
      [state.frontIndex, state.rearIndex],
      state.capacity,
    ),
    boundaryIndices: getCircularQueueBoundaries(state),
    result: "accessed",
    currentLabel: "AVAILABLE",
    description: `isFull() devuelve false. Espacios disponibles: ${
      state.capacity - state.size
    }.`,
  };
}

export const createCircularQueueOperationGenerator = (
  values: CircularQueueSlot[],
  config: CircularQueueOperationConfig,
): Generator<AlgoStep, void, unknown> => {
  if (config.operationId === "enqueue") {
    return circularQueueEnqueueGenerator(values, config);
  }

  if (config.operationId === "dequeue") {
    return circularQueueDequeueGenerator(values, config);
  }

  if (config.operationId === "front") {
    return circularQueueFrontGenerator(values, config);
  }

  if (config.operationId === "rear") {
    return circularQueueRearGenerator(values, config);
  }

  if (config.operationId === "is-empty") {
    return circularQueueIsEmptyGenerator(values, config);
  }

  if (config.operationId === "is-full") {
    return circularQueueIsFullGenerator(values, config);
  }

  return circularQueueTraversalGenerator(values, config);
};