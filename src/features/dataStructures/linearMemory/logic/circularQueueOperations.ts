// Ruta:
// src/features/dataStructures/linearMemory/logic/circularQueueOperations.ts

/**
 * circularQueueOperations
 *
 * Lógica pura para operaciones sobre Circular Queue.
 *
 * Circular Queue:
 * - Cola circular.
 * - Mantiene lógica FIFO.
 * - FIFO significa First In, First Out.
 * - En español: primero en entrar, primero en salir.
 *
 * Diferencia con Queue normal:
 * - En una Queue lineal, REAR avanza hacia el final.
 * - En una Circular Queue, cuando REAR llega al último índice,
 *   puede volver al índice 0 si hay espacio disponible.
 *
 * Fórmula clave:
 * - nextRear = (rear + 1) % capacity
 * - nextFront = (front + 1) % capacity
 *
 * Importante:
 * - No usa React.
 * - No usa Three.js.
 * - No usa Zustand.
 * - Solo emite pasos visuales.
 *
 * Representación:
 * - values representa las celdas físicas de la cola circular.
 * - Un valor null representa una celda vacía.
 *
 * Ejemplo:
 * [40, null, null, 12, 18]
 *  ↑              ↑
 * REAR           FRONT
 */

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

  /**
   * Valor que se agregará en enqueue().
   */
  enqueueValue: number;

  /**
   * Capacidad máxima de la cola circular.
   *
   * Si no se proporciona, se usa values.length.
   */
  capacity?: number;

  /**
   * Índice lógico de FRONT.
   */
  frontIndex?: number;

  /**
   * Índice lógico de REAR.
   */
  rearIndex?: number;

  /**
   * Cantidad de elementos ocupados.
   *
   * Si no se proporciona, se calcula contando las celdas no vacías.
   */
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

/**
 * Operación:
 * Recorrer cola circular.
 *
 * Se recorre en orden lógico FIFO:
 * - empieza en FRONT
 * - avanza usando módulo
 * - termina en REAR
 */
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

/**
 * Operación:
 * enqueue()
 *
 * Agrega un nuevo valor en la posición siguiente a REAR.
 *
 * Si REAR está al final, usa:
 * nextRear = (rear + 1) % capacity
 */
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

/**
 * Operación:
 * dequeue()
 *
 * Retira el elemento ubicado en FRONT.
 *
 * Si FRONT está al final y todavía quedan elementos, usa:
 * nextFront = (front + 1) % capacity
 */
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

/**
 * Operación:
 * front()
 *
 * Consulta FRONT sin retirarlo.
 */
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

/**
 * Operación:
 * rear()
 *
 * Consulta REAR sin retirarlo.
 */
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

/**
 * Operación:
 * isEmpty()
 */
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

/**
 * Operación:
 * isFull()
 */
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

/**
 * Crea el generador correcto según la operación seleccionada.
 */
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