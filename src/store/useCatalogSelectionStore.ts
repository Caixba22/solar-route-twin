// Ruta:
// src/store/useCatalogSelectionStore.ts

import { create } from "zustand";

import type {
  CatalogDomainId,
  CatalogItemId,
} from "../shared/constants/catalog";

interface CatalogSelectionState {
  activeDomainId: CatalogDomainId;

  selectedItemId: CatalogItemId | null;

  selectDomain: (domainId: CatalogDomainId) => void;

  selectItem: (itemId: CatalogItemId) => void;

  clearSelectedItem: () => void;

  clearSelection: () => void;
}

export const useCatalogSelectionStore = create<CatalogSelectionState>((set) => ({
  /**
   * Inicia en el dominio de estructuras de datos,
   * pero sin seleccionar todavía una estructura específica.
   */
  activeDomainId: "data-structures",

  /**
   * No hay item seleccionado al inicio.
   *
   * Esto permite que el workspace muestre algo como:
   * "Selecciona una estructura de datos".
   */
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
      activeDomainId: "data-structures",
      selectedItemId: null,
    }),
}));