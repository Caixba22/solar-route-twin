// Ruta:
// src/store/useCatalogSelectionStore.ts

import { create } from "zustand";

import type {
  CatalogDomainId,
  CatalogItemId,
} from "../shared/constants/catalog";

interface CatalogSelectionState {
  /**
   * Dominio activo del workspace.
   *
   * Puede ser null para permitir que la app inicie
   * sin seleccionar Estructuras de datos ni Algoritmos.
   */
  activeDomainId: CatalogDomainId | null;

  /**
   * Item seleccionado dentro del dominio activo.
   *
   * Inicia en null porque no queremos seleccionar
   * ningún algoritmo ni estructura por defecto.
   */
  selectedItemId: CatalogItemId | null;

  selectDomain: (domainId: CatalogDomainId) => void;

  selectItem: (itemId: CatalogItemId) => void;

  clearSelectedItem: () => void;

  clearSelection: () => void;
}

export const useCatalogSelectionStore = create<CatalogSelectionState>((set) => ({
  /**
   * Inicio sin selección.
   */
  activeDomainId: null,

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
      activeDomainId: null,
      selectedItemId: null,
    }),
}));