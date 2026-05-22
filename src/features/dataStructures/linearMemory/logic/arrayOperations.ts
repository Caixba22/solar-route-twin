// Ruta:
// src/features/dataStructures/linearMemory/logic/arrayOperations.ts

/**
 * arrayOperations
 *
 * Lógica pura para operaciones sobre arrays.
 *
 * Importante:
 * - No usa React.
 * - No usa Three.js.
 * - No usa Zustand.
 * - Solo emite pasos visuales.
 *
 * Criterio técnico:
 * - Recorrer y buscar sí avanzan de izquierda a derecha.
 * - Acceder, actualizar e insertar por índice NO simulan una búsqueda lineal.
 * - Insertar por índice valida/accede directamente al índice indicado.
 * - El corrimiento de inserción se hace de derecha a izquierda para no
 *   sobrescribir datos antes de moverlos.
 */

import type { AlgoStep } from "../../../../shared/types/runtime.types";
import type { LinearMemoryOperationConfig } from "../types/linearMemory.types";

/**
 * Devuelve los extremos del array para marcarlos visualmente.
 *
 * boundary significa frontera o límite.
 * En un array nos sirve para mostrar:
 * - primera posición
 * - última posición
 */
const getArrayBoundaries = (values: number[]): number[] => {
  if (values.length === 0) return [];
  if (values.length === 1) return [0];

  return [0, values.length - 1];
};

/**
 * Crea una lista de índices desde 0 hasta endExclusive - 1.
 *
 * Ejemplo:
 * createIndexRange(3) => [0, 1, 2]
 */
const createIndexRange = (endExclusive: number): number[] => {
  return Array.from({ length: endExclusive }, (_, index) => index);
};

/**
 * Limita un índice para que siempre esté dentro del array.
 */
const clampIndex = (index: number, total: number): number => {
  if (total <= 0) return 0;

  return Math.max(0, Math.min(index, total - 1));
};

/**
 * Limita un índice de inserción.
 *
 * A diferencia de clampIndex, aquí sí permitimos insertar en values.length
 * porque esa posición representa "al final del array".
 */
const clampInsertIndex = (index: number, total: number): number => {
  return Math.max(0, Math.min(index, total));
};

/**
 * Operación 1:
 * Recorrido del array de izquierda a derecha.
 *
 * Visualmente:
 * - activeIndices marca la celda actual.
 * - sortedIndices marca las celdas ya visitadas.
 * - boundaryIndices marca los extremos del array.
 */
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

/**
 * Operación 2:
 * Búsqueda lineal de un valor.
 *
 * Visualmente:
 * - comparing marca la celda que se está comparando.
 * - sorted marca el valor encontrado.
 * - critical marca que no se encontró el valor.
 */
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

/**
 * Operación 3:
 * Acceso directo por índice.
 *
 * A diferencia de search, no recorre celda por celda.
 * Va directo a la posición solicitada.
 */
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

/**
 * Operación 4:
 * Actualización directa por índice.
 *
 * Idea conceptual:
 * - Igual que access, no necesita recorrer todo el array.
 * - Va directamente a la posición indicada.
 * - Reemplaza el valor anterior por el nuevo valor.
 *
 * Nota:
 * - Este generador NO muta el arreglo.
 * - Solo describe la operación visual.
 */
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

/**
 * Operación 5:
 * Agregar un valor al final.
 *
 * Conceptualmente:
 * - El nuevo valor se coloca después del último elemento.
 * - En un array dinámico suele ser una operación eficiente al final.
 */
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

/**
 * Operación 6:
 * Insertar un valor en una posición específica.
 *
 * Conceptualmente:
 * - Insertar por índice NO es una búsqueda lineal.
 * - Primero se valida/accede directamente al índice solicitado.
 * - Después se abre espacio desplazando elementos hacia la derecha.
 * - Ese desplazamiento se realiza de derecha a izquierda para no sobrescribir
 *   valores que todavía deben moverse.
 *
 * Ejemplo:
 * Array original:
 * [12, 7, 30, 5]
 *
 * Insertar 99 en índice 1:
 * - Se valida el índice 1.
 * - 5 se mueve de 3 a 4.
 * - 30 se mueve de 2 a 3.
 * - 7 se mueve de 1 a 2.
 * - 99 entra en 1.
 *
 * Resultado:
 * [12, 99, 7, 30, 5]
 */
function* arrayInsertGenerator(
  values: number[],
  requestedIndex: number,
  nextValue: number,
): Generator<AlgoStep, void, unknown> {
  const boundaryIndices = getArrayBoundaries(values);
  const safeIndex = clampInsertIndex(requestedIndex, values.length);

  /**
   * Si el índice de inserción es igual al tamaño del array,
   * conceptualmente equivale a agregar al final.
   */
  if (safeIndex === values.length) {
    yield* arrayPushGenerator(values, nextValue);
    return;
  }

  /**
   * Paso 1:
   * Validación/acceso directo al índice de inserción.
   *
   * No recorremos desde 0 porque insertar por índice no necesita buscar
   * la posición. El índice ya fue proporcionado por el usuario.
   */
  yield {
    type: "boundary",
    activeIndices: [safeIndex],
    boundaryIndices,
    result: "visiting",
    currentLabel: "INDEX",
    description: `Índice de inserción validado: ${safeIndex}. Se abrirá espacio para insertar ${nextValue}.`,
  };

  /**
   * Paso 2:
   * Corrimiento hacia la derecha.
   *
   * Este bucle va de derecha a izquierda de forma intencional.
   * Es el orden correcto para mover elementos dentro del mismo array
   * sin sobrescribir valores pendientes.
   */
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

  /**
   * Paso 3:
   * Inserción final en el índice solicitado.
   */
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

/**
 * Operación 7:
 * Eliminar un valor por índice.
 *
 * Conceptualmente:
 * - Se elimina la celda objetivo.
 * - Los elementos posteriores se desplazan una posición hacia la izquierda.
 * - Por eso eliminar en medio de un array puede costar O(n).
 */
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

/**
 * Crea el generador correcto según la operación seleccionada.
 *
 * Este es el punto único donde Array decide qué operación ejecutar.
 */
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