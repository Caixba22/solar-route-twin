// Ruta:
// src/features/dataStructures/linearMemory/logic/stackOperations.ts

/**
 * stackOperations
 *
 * Lógica pura para operaciones sobre Stack.
 *
 * Stack:
 * - Estructura LIFO.
 * - LIFO significa Last In, First Out.
 * - En español: último en entrar, primero en salir.
 *
 * Importante:
 * - No usa React.
 * - No usa Three.js.
 * - No usa Zustand.
 * - Solo emite pasos visuales.
 *
 * Representación visual:
 * - Usamos una memoria lineal.
 * - El TOP de la pila se considera el último índice del arreglo.
 *
 * Ejemplo:
 * [12, 7, 30]
 *           ↑
 *          TOP
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";

export const STACK_OPERATION_IDS = [
  "traverse",
  "push",
  "pop",
  "peek",
  "is-empty",
] as const;

export type StackOperationId = (typeof STACK_OPERATION_IDS)[number];

export type StackOperationConfig = {
  operationId: StackOperationId;

  /**
   * Valor que se agregará en push().
   */
  pushValue: number;
};

const createIndexRange = (endExclusive: number): number[] => {
  return Array.from({ length: endExclusive }, (_, index) => index);
};

const getStackTopIndex = (values: number[]): number => {
  return values.length - 1;
};

const getStackBoundaries = (values: number[]): number[] => {
  if (values.length === 0) return [];
  if (values.length === 1) return [0];

  return [0, values.length - 1];
};

/**
 * Operación:
 * Recorrer pila.
 *
 * A diferencia del array, aquí el recorrido didáctico se hace desde TOP
 * hacia la base, porque Stack se entiende desde su parte superior.
 */
function* stackTraversalGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "La pila está vacía. No hay elementos para recorrer.",
    };

    return;
  }

  const boundaryIndices = getStackBoundaries(values);
  const visitedIndices: number[] = [];
  const topIndex = getStackTopIndex(values);

  for (let index = topIndex; index >= 0; index--) {
    yield {
      type: "active",
      activeIndices: [index],
      boundaryIndices,
      sortedIndices: [...visitedIndices],
      result: "visiting",
      currentLabel: index === topIndex ? "TOP" : "STACK",
      description: `Recorriendo la pila desde TOP. Índice actual: ${index}. Valor: ${values[index]}.`,
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
    description: "Recorrido de la pila terminado.",
  };
}

/**
 * Operación:
 * push()
 *
 * Agrega un nuevo valor sobre el TOP actual.
 *
 * Nota:
 * Este generador no muta el arreglo.
 * Solo describe la operación visual.
 */
function* stackPushGenerator(
  values: number[],
  nextValue: number,
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "active",
      activeIndices: [],
      result: "visiting",
      currentLabel: "PUSH",
      description: `La pila está vacía. El valor ${nextValue} será el primer elemento y también el TOP.`,
    };

    yield {
      type: "sorted",
      activeIndices: [],
      result: "finished",
      currentLabel: "PUSHED",
      description: `Operación push terminada. ${nextValue} fue agregado a la pila.`,
    };

    return;
  }

  const boundaryIndices = getStackBoundaries(values);
  const topIndex = getStackTopIndex(values);
  const nextTopIndex = values.length;

  yield {
    type: "boundary",
    activeIndices: [topIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "TOP",
    description: `TOP actual ubicado en el índice ${topIndex}. Valor actual: ${values[topIndex]}.`,
  };

  yield {
    type: "active",
    activeIndices: [topIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "PUSH",
    description: `El valor ${nextValue} se colocará sobre el TOP actual, en el nuevo índice ${nextTopIndex}.`,
  };

  yield {
    type: "sorted",
    activeIndices: [topIndex],
    boundaryIndices,
    sortedIndices: [topIndex],
    result: "finished",
    currentLabel: "PUSHED",
    description: `Operación push terminada. ${nextValue} quedó como nuevo TOP de la pila.`,
  };
}

/**
 * Operación:
 * pop()
 *
 * Elimina el elemento que está en TOP.
 *
 * En Stack, pop siempre actúa sobre el último elemento agregado.
 */
function* stackPopGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "No se puede hacer pop porque la pila está vacía.",
    };

    return;
  }

  const boundaryIndices = getStackBoundaries(values);
  const topIndex = getStackTopIndex(values);
  const removedValue = values[topIndex];

  yield {
    type: "critical",
    activeIndices: [topIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "POP",
    description: `pop() elimina el TOP. Índice: ${topIndex}. Valor a retirar: ${removedValue}.`,
  };

  yield {
    type: "sorted",
    activeIndices: topIndex > 0 ? [topIndex - 1] : [],
    boundaryIndices,
    sortedIndices: createIndexRange(Math.max(values.length - 1, 0)),
    result: "finished",
    currentLabel: "POPPED",
    description:
      topIndex > 0
        ? `Operación pop terminada. Se retiró ${removedValue}. El nuevo TOP será el índice ${
            topIndex - 1
          }.`
        : `Operación pop terminada. Se retiró ${removedValue}. La pila quedó vacía.`,
  };
}

/**
 * Operación:
 * peek()
 *
 * Consulta el valor en TOP sin eliminarlo.
 */
function* stackPeekGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "critical",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "No se puede hacer peek porque la pila está vacía.",
    };

    return;
  }

  const boundaryIndices = getStackBoundaries(values);
  const topIndex = getStackTopIndex(values);

  yield {
    type: "active",
    activeIndices: [topIndex],
    boundaryIndices,
    result: "accessed",
    currentLabel: "PEEK",
    description: `peek() consulta el TOP sin retirarlo. Índice: ${topIndex}. Valor: ${values[topIndex]}.`,
  };
}

/**
 * Operación:
 * isEmpty()
 *
 * Comprueba si la pila está vacía.
 */
function* stackIsEmptyGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) {
    yield {
      type: "sorted",
      activeIndices: [],
      result: "finished",
      currentLabel: "EMPTY",
      description: "isEmpty() devuelve true. La pila está vacía.",
    };

    return;
  }

  const boundaryIndices = getStackBoundaries(values);
  const topIndex = getStackTopIndex(values);

  yield {
    type: "boundary",
    activeIndices: [topIndex],
    boundaryIndices,
    result: "accessed",
    currentLabel: "NOT EMPTY",
    description: `isEmpty() devuelve false. La pila tiene ${values.length} elemento(s). TOP está en el índice ${topIndex}.`,
  };
};

/**
 * Crea el generador correcto según la operación seleccionada.
 */
export const createStackOperationGenerator = (
  values: number[],
  config: StackOperationConfig,
): Generator<AlgoStep, void, unknown> => {
  if (config.operationId === "push") {
    return stackPushGenerator(values, config.pushValue);
  }

  if (config.operationId === "pop") {
    return stackPopGenerator(values);
  }

  if (config.operationId === "peek") {
    return stackPeekGenerator(values);
  }

  if (config.operationId === "is-empty") {
    return stackIsEmptyGenerator(values);
  }

  return stackTraversalGenerator(values);
};