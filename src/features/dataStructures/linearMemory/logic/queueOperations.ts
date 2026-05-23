// src/features/dataStructures/linearMemory/logic/queueOperations.ts

import type { AlgoStep } from "../../../../shared/types/runtime.types";

export const QUEUE_OPERATION_IDS = [
  "traverse",
  "enqueue",
  "dequeue",
  "front",
  "rear",
  "is-empty",
] as const;

export type QueueOperationId = (typeof QUEUE_OPERATION_IDS)[number];

export type QueueOperationConfig = {
  operationId: QueueOperationId;

  enqueueValue: number;
};

const createIndexRange = (endExclusive: number): number[] => {
  return Array.from({ length: endExclusive }, (_, index) => index);
};

const getQueueFrontIndex = (values: number[]): number => {
  return 0;
};

const getQueueRearIndex = (values: number[]): number => {
  return values.length - 1;
};

const getQueueBoundaries = (values: number[]): number[] => {
  if (values.length === 0) return [];
  if (values.length === 1) return [0];

  return [0, values.length - 1];
};

function* queueTraversalGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "La cola está vacía. No hay elementos para recorrer.",
    };

    return;
  }

  const boundaryIndices = getQueueBoundaries(values);
  const visitedIndices: number[] = [];

  for (let index = 0; index < values.length; index++) {
    yield {
      type: "active",
      activeIndices: [index],
      boundaryIndices,
      sortedIndices: [...visitedIndices],
      result: "visiting",
      currentLabel:
        index === 0
          ? "FRONT"
          : index === values.length - 1
            ? "REAR"
            : "QUEUE",
      description: `Recorriendo la cola de FRONT a REAR. Índice actual: ${index}. Valor: ${values[index]}.`,
    };

    visitedIndices.push(index);
  }

  yield {
    type: "sorted",
    activeIndices: [],
    boundaryIndices,
    sortedIndices: createIndexRange(values.length),
    result: "finished",
    currentLabel: "DONE",
    description: "Recorrido de la cola terminado.",
  };
}

function* queueEnqueueGenerator(
  values: number[],
  nextValue: number,
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "active",
      activeIndices: [],
      result: "visiting",
      currentLabel: "ENQUEUE",
      description: `La cola está vacía. El valor ${nextValue} será el primer elemento, por lo tanto será FRONT y REAR.`,
    };

    yield {
      type: "sorted",
      activeIndices: [],
      result: "finished",
      currentLabel: "ENQUEUED",
      description: `Operación enqueue terminada. ${nextValue} fue agregado a la cola.`,
    };

    return;
  }

  const boundaryIndices = getQueueBoundaries(values);
  const rearIndex = getQueueRearIndex(values);
  const nextRearIndex = values.length;

  yield {
    type: "boundary",
    activeIndices: [rearIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "REAR",
    description: `REAR actual ubicado en el índice ${rearIndex}. Valor actual: ${values[rearIndex]}.`,
  };

  yield {
    type: "active",
    activeIndices: [rearIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "ENQUEUE",
    description: `El valor ${nextValue} entrará al final de la cola, en el nuevo índice ${nextRearIndex}.`,
  };

  yield {
    type: "sorted",
    activeIndices: [rearIndex],
    boundaryIndices,
    sortedIndices: [rearIndex],
    result: "finished",
    currentLabel: "ENQUEUED",
    description: `Operación enqueue terminada. ${nextValue} quedó como nuevo REAR de la cola.`,
  };
}

function* queueDequeueGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "No se puede hacer dequeue porque la cola está vacía.",
    };

    return;
  }

  const boundaryIndices = getQueueBoundaries(values);
  const frontIndex = getQueueFrontIndex(values);
  const rearIndex = getQueueRearIndex(values);
  const removedValue = values[frontIndex];

  yield {
    type: "critical",
    activeIndices: [frontIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "DEQUEUE",
    description: `dequeue() retira el FRONT. Índice: ${frontIndex}. Valor a retirar: ${removedValue}.`,
  };

  if (values.length > 1) {
    yield {
      type: "active",
      activeIndices: [frontIndex + 1],
      boundaryIndices: [frontIndex + 1, rearIndex],
      result: "accessed",
      currentLabel: "NEW FRONT",
      description: `Después de retirar ${removedValue}, el siguiente elemento pasará a ser FRONT. Nuevo FRONT lógico: índice ${
        frontIndex + 1
      }.`,
    };
  }

  yield {
    type: "sorted",
    activeIndices: values.length > 1 ? [frontIndex + 1] : [],
    boundaryIndices,
    sortedIndices:
      values.length > 1 ? createIndexRange(values.length).slice(1) : [],
    result: "finished",
    currentLabel: "DEQUEUED",
    description:
      values.length > 1
        ? `Operación dequeue terminada. Se retiró ${removedValue}. La cola conserva el orden FIFO.`
        : `Operación dequeue terminada. Se retiró ${removedValue}. La cola quedó vacía.`,
  };
}

function* queueFrontGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "No se puede consultar FRONT porque la cola está vacía.",
    };

    return;
  }

  const boundaryIndices = getQueueBoundaries(values);
  const frontIndex = getQueueFrontIndex(values);

  yield {
    type: "active",
    activeIndices: [frontIndex],
    boundaryIndices,
    result: "accessed",
    currentLabel: "FRONT",
    description: `front() consulta el primer elemento sin retirarlo. Índice: ${frontIndex}. Valor: ${values[frontIndex]}.`,
  };
}

function* queueRearGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "No se puede consultar REAR porque la cola está vacía.",
    };

    return;
  }

  const boundaryIndices = getQueueBoundaries(values);
  const rearIndex = getQueueRearIndex(values);

  yield {
    type: "active",
    activeIndices: [rearIndex],
    boundaryIndices,
    result: "accessed",
    currentLabel: "REAR",
    description: `rear() consulta el último elemento sin retirarlo. Índice: ${rearIndex}. Valor: ${values[rearIndex]}.`,
  };
}

function* queueIsEmptyGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "sorted",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "isEmpty() devuelve true. La cola está vacía.",
    };

    return;
  }

  const boundaryIndices = getQueueBoundaries(values);
  const frontIndex = getQueueFrontIndex(values);
  const rearIndex = getQueueRearIndex(values);

  yield {
    type: "boundary",
    activeIndices: [frontIndex, rearIndex],
    boundaryIndices,
    result: "accessed",
    currentLabel: "NOT EMPTY",
    description: `isEmpty() devuelve false. La cola tiene ${values.length} elemento(s). FRONT está en ${frontIndex} y REAR está en ${rearIndex}.`,
  };
}

export const createQueueOperationGenerator = (
  values: number[],
  config: QueueOperationConfig,
): Generator<AlgoStep, void, unknown> => {
  if (config.operationId === "enqueue") {
    return queueEnqueueGenerator(values, config.enqueueValue);
  }

  if (config.operationId === "dequeue") {
    return queueDequeueGenerator(values);
  }

  if (config.operationId === "front") {
    return queueFrontGenerator(values);
  }

  if (config.operationId === "rear") {
    return queueRearGenerator(values);
  }

  if (config.operationId === "is-empty") {
    return queueIsEmptyGenerator(values);
  }

  return queueTraversalGenerator(values);
};