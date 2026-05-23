// src/features/dataStructures/linearMemory/logic/arrayOperations.ts

import type { AlgoStep } from "../../../../shared/types/runtime.types";
import type { LinearMemoryOperationConfig } from "../types/linearMemory.types";

const getArrayBoundaries = (values: number[]): number[] => {
  if (values.length === 0) return [];
  if (values.length === 1) return [0];

  return [0, values.length - 1];
};


const createIndexRange = (endExclusive: number): number[] => {
  return Array.from({ length: endExclusive }, (_, index) => index);
};

const clampIndex = (index: number, total: number): number => {
  if (total <= 0) return 0;

  return Math.max(0, Math.min(index, total - 1));
};


const clampInsertIndex = (index: number, total: number): number => {
  return Math.max(0, Math.min(index, total));
};

function* arrayTraversalGenerator(
  values: number[],
): Generator<AlgoStep, void, unknown> {
  const boundaryIndices = getArrayBoundaries(values);

  for (let index = 0; index < values.length; index++) {
    yield {
      type: "active",
      activeIndices: [index],
      boundaryIndices,
      sortedIndices: createIndexRange(index),
      result: "visiting",
      currentLabel: "CURRENT",
      description: `Visitando el índice ${index}. Valor actual: ${values[index]}.`,
    };
  }

  yield {
    type: "sorted",
    activeIndices: [],
    boundaryIndices,
    sortedIndices: createIndexRange(values.length),
    result: "finished",
    description: `Recorrido terminado. Se visitaron ${values.length} celdas del array.`,
  };
}

function* arraySearchGenerator(
  values: number[],
  target: number,
): Generator<AlgoStep, void, unknown> {
  const boundaryIndices = getArrayBoundaries(values);
  const visitedIndices: number[] = [];

  for (let index = 0; index < values.length; index++) {
    yield {
      type: "comparing",
      activeIndices: [index],
      comparingIndices: [index],
      boundaryIndices,
      sortedIndices: [...visitedIndices],
      result: "comparing",
      currentLabel: "CURRENT",
      description: `Comparando índice ${index}: ${values[index]} === ${target}.`,
    };

    if (values[index] === target) {
      yield {
        type: "sorted",
        activeIndices: [index],
        boundaryIndices,
        sortedIndices: [...visitedIndices, index],
        result: "found",
        currentLabel: "FOUND",
        description: `Valor encontrado. ${target} está en el índice ${index}.`,
      };

      return;
    }

    visitedIndices.push(index);
  }

  yield {
    type: "critical",
    activeIndices: createIndexRange(values.length),
    boundaryIndices,
    result: "not-found",
    description: `El valor ${target} no se encontró dentro del array.`,
  };
}

function* arrayAccessGenerator(
  values: number[],
  requestedIndex: number,
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) return;

  const boundaryIndices = getArrayBoundaries(values);
  const safeIndex = clampIndex(requestedIndex, values.length);

  yield {
    type: "boundary",
    activeIndices: [safeIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "INDEX",
    description: `Validando el índice solicitado. El rango permitido es 0 a ${
      values.length - 1
    }.`,
  };

  yield {
    type: "active",
    activeIndices: [safeIndex],
    boundaryIndices,
    result: "accessed",
    currentLabel: "ACCESS",
    description: `Acceso directo: índice ${safeIndex}, valor ${values[safeIndex]}.`,
  };
}

function* arrayUpdateGenerator(
  values: number[],
  requestedIndex: number,
  nextValue: number,
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) return;

  const boundaryIndices = getArrayBoundaries(values);
  const safeIndex = clampIndex(requestedIndex, values.length);
  const previousValue = values[safeIndex];

  yield {
    type: "boundary",
    activeIndices: [safeIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "INDEX",
    description: `Validando el índice a actualizar. El rango permitido es 0 a ${
      values.length - 1
    }.`,
  };

  yield {
    type: "active",
    activeIndices: [safeIndex],
    boundaryIndices,
    result: "accessed",
    currentLabel: "UPDATE",
    description: `Actualización directa: índice ${safeIndex}. Valor anterior: ${previousValue}. Nuevo valor: ${nextValue}.`,
  };

  yield {
    type: "sorted",
    activeIndices: [safeIndex],
    boundaryIndices,
    sortedIndices: [safeIndex],
    result: "finished",
    currentLabel: "UPDATED",
    description: `Actualización terminada. array[${safeIndex}] cambió de ${previousValue} a ${nextValue}.`,
  };
}

function* arrayPushGenerator(
  values: number[],
  nextValue: number,
): Generator<AlgoStep, void, unknown> {
  const boundaryIndices = getArrayBoundaries(values);
  const lastIndex = values.length - 1;
  const nextIndex = values.length;

  if (values.length === 0) {
    yield {
      type: "active",
      activeIndices: [],
      boundaryIndices,
      result: "visiting",
      currentLabel: "PUSH",
      description: `El array está vacío. El valor ${nextValue} se agregará en el índice 0.`,
    };

    yield {
      type: "sorted",
      activeIndices: [],
      boundaryIndices,
      result: "finished",
      currentLabel: "ADDED",
      description: `Valor agregado. ${nextValue} quedó al final del array.`,
    };

    return;
  }

  yield {
    type: "boundary",
    activeIndices: [lastIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "TAIL",
    description: `Ubicando el final actual del array. Último índice: ${lastIndex}.`,
  };

  yield {
    type: "active",
    activeIndices: [lastIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "PUSH",
    description: `Preparando nueva posición al final. El valor ${nextValue} entrará en el índice ${nextIndex}.`,
  };

  yield {
    type: "sorted",
    activeIndices: [lastIndex],
    boundaryIndices,
    sortedIndices: [lastIndex],
    result: "finished",
    currentLabel: "ADDED",
    description: `Valor agregado al final. ${nextValue} quedó en el nuevo índice ${nextIndex}.`,
  };
}

function* arrayInsertGenerator(
  values: number[],
  requestedIndex: number,
  nextValue: number,
): Generator<AlgoStep, void, unknown> {
  const boundaryIndices = getArrayBoundaries(values);
  const safeIndex = clampInsertIndex(requestedIndex, values.length);

  if (safeIndex === values.length) {
    yield* arrayPushGenerator(values, nextValue);
    return;
  }

  yield {
    type: "boundary",
    activeIndices: [safeIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "INDEX",
    description: `Índice de inserción validado: ${safeIndex}. Se abrirá espacio para insertar ${nextValue}.`,
  };

  for (let index = values.length - 1; index >= safeIndex; index--) {
    yield {
      type: "comparing",
      activeIndices: [index],
      comparingIndices: [index],
      boundaryIndices: [safeIndex, values.length - 1],
      result: "comparing",
      currentLabel: "SHIFT",
      description: `Corrimiento técnico: el valor ${values[index]} pasa del índice ${index} al índice ${
        index + 1
      }.`,
    };
  }

  yield {
    type: "sorted",
    activeIndices: [safeIndex],
    boundaryIndices,
    sortedIndices: [safeIndex],
    result: "finished",
    currentLabel: "INSERTED",
    description: `Inserción terminada. El valor ${nextValue} fue colocado en el índice ${safeIndex}.`,
  };
}

function* arrayDeleteGenerator(
  values: number[],
  requestedIndex: number,
): Generator<AlgoStep, void, unknown> {
  if (values.length === 0) return;

  const boundaryIndices = getArrayBoundaries(values);
  const safeIndex = clampIndex(requestedIndex, values.length);
  const removedValue = values[safeIndex];

  yield {
    type: "critical",
    activeIndices: [safeIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "DELETE",
    description: `Seleccionando el índice ${safeIndex} para eliminar. Valor a remover: ${removedValue}.`,
  };

  for (let index = safeIndex + 1; index < values.length; index++) {
    yield {
      type: "comparing",
      activeIndices: [index],
      comparingIndices: [index],
      boundaryIndices: [safeIndex, values.length - 1],
      result: "comparing",
      currentLabel: "SHIFT",
      description: `Corrimiento técnico: el valor ${values[index]} pasa del índice ${index} al índice ${
        index - 1
      }.`,
    };
  }

  yield {
    type: "sorted",
    activeIndices: [safeIndex],
    boundaryIndices,
    sortedIndices: createIndexRange(Math.max(values.length - 1, 0)),
    result: "finished",
    currentLabel: "DELETED",
    description: `Eliminación terminada. Se removió el valor ${removedValue} del índice ${safeIndex}.`,
  };
}

export const createArrayOperationGenerator = (
  values: number[],
  config: LinearMemoryOperationConfig,
): Generator<AlgoStep, void, unknown> => {
  if (config.operationId === "search") {
    return arraySearchGenerator(values, config.searchTarget);
  }

  if (config.operationId === "access") {
    return arrayAccessGenerator(values, config.accessIndex);
  }

  if (config.operationId === "update") {
    return arrayUpdateGenerator(
      values,
      config.updateIndex,
      config.updateValue,
    );
  }

  if (config.operationId === "push") {
    return arrayPushGenerator(values, config.pushValue);
  }

  if (config.operationId === "insert") {
    return arrayInsertGenerator(
      values,
      config.insertIndex,
      config.insertValue,
    );
  }

  if (config.operationId === "delete") {
    return arrayDeleteGenerator(values, config.deleteIndex);
  }

  return arrayTraversalGenerator(values);
};