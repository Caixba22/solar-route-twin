// Ruta:
// src/store/useCatalogSelectionStore.ts

/**
 * useCatalogSelectionStore
 *
 * Store global de Zustand para controlar la selección del catálogo.
 *
 * Responsabilidades:
 * - Saber si el usuario eligió "algoritmos" o "estructuras de datos".
 * - Saber qué elemento concreto está seleccionado.
 * - Actuar como router visual del workspace.
 *
 * Importante:
 * - Este store NO ejecuta algoritmos.
 * - Este store NO guarda datos 3D.
 * - Este store NO guarda arreglos masivos.
 * - Solo guarda IDs de selección.
 */

import { create } from "zustand";

import type {
  CatalogDomainId,
  CatalogItemId,
} from "../shared/constants/catalog";

interface CatalogSelectionState {
  /**
   * Dominio activo del laboratorio.
   *
   * Puede ser:
   * - "data-structures"
   * - "algorithms"
   *
   * Lo dejamos por defecto en "algorithms"
   * porque actualmente Bubble Sort ya está implementado.
   */
  activeDomainId: CatalogDomainId;

  /**
   * Item concreto seleccionado.
   *
   * Ejemplo actual:
   * - "bubble-sort"
   */
  selectedItemId: CatalogItemId | null;

  /**
   * Cambia el dominio activo.
   *
   * También limpia selectedItemId para evitar que quede seleccionado
   * un algoritmo cuando cambias a estructuras, o una estructura
   * cuando cambias a algoritmos.
   */
  selectDomain: (domainId: CatalogDomainId) => void;

  /**
   * Selecciona un item concreto del catálogo.
   */
  selectItem: (itemId: CatalogItemId) => void;

  /**
   * Limpia solo el item seleccionado,
   * pero mantiene el dominio activo.
   */
  clearSelectedItem: () => void;

  /**
   * Reinicia toda la selección al estado inicial.
   */
  clearSelection: () => void;
}

export const useCatalogSelectionStore = create<CatalogSelectionState>((set) => ({
  activeDomainId: "algorithms",
  selectedItemId: null,

  selectDomain: (domainId) =>
    set({
      activeDomainId: domainId,
      selectedItemId: null,
    }),

  selectItem: (itemId) =>
    set({
      selectedItemId: itemId,
    }),

  clearSelectedItem: () =>
    set({
      selectedItemId: null,
    }),

  clearSelection: () =>
    set({
      activeDomainId: "algorithms",
      selectedItemId: null,
    }),
}));