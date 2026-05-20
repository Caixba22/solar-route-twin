// Ruta:
// src/shared/constants/catalogSelectors.ts

/**
 * Selectores del catálogo.
 *
 * Este archivo contiene funciones pequeñas para consultar el catálogo
 * sin repetir lógica en los componentes.
 *
 * Ejemplos:
 * - Obtener categorías de un dominio.
 * - Obtener solo categorías que ya tienen items implementados.
 * - Obtener items de una categoría.
 * - Obtener items de un dominio.
 */

import {
  CATALOG_CATEGORIES,
  CATALOG_DOMAINS,
  CATALOG_ITEMS,
  type CatalogCategory,
  type CatalogCategoryId,
  type CatalogDomain,
  type CatalogDomainId,
  type CatalogItem,
  type CatalogItemId,
  type CatalogItemType,
} from "./catalog";

/**
 * Ordena cualquier elemento del catálogo usando su propiedad order.
 */
const sortByOrder = <T extends { order: number }>(items: readonly T[]) => {
  return [...items].sort((first, second) => first.order - second.order);
};

/**
 * Devuelve todos los dominios ordenados.
 *
 * Útil para el menú flotante.
 */
export const getCatalogDomains = (): CatalogDomain[] => {
  return sortByOrder(CATALOG_DOMAINS);
};

/**
 * Busca un dominio por su id.
 */
export const getCatalogDomainById = (
  domainId: CatalogDomainId,
): CatalogDomain | undefined => {
  return CATALOG_DOMAINS.find((domain) => domain.id === domainId);
};

/**
 * Devuelve todas las categorías ordenadas.
 */
export const getCatalogCategories = (): CatalogCategory[] => {
  return sortByOrder(CATALOG_CATEGORIES);
};

/**
 * Devuelve las categorías que pertenecen a un dominio.
 *
 * Ejemplo:
 * domainId = "algorithms"
 * devuelve categorías como:
 * - Ordenamiento por comparación
 * - Ordenamiento por división
 * - Búsqueda de caminos
 */
export const getCategoriesByDomain = (
  domainId: CatalogDomainId,
): CatalogCategory[] => {
  return sortByOrder(
    CATALOG_CATEGORIES.filter((category) => category.domainId === domainId),
  );
};

/**
 * Devuelve las categorías de un dominio que sí tienen items implementados.
 *
 * Esto evita mostrar categorías vacías en la interfaz.
 */
export const getVisibleCategoriesByDomain = (
  domainId: CatalogDomainId,
): CatalogCategory[] => {
  const categories = getCategoriesByDomain(domainId);

  return categories.filter((category) =>
    CATALOG_ITEMS.some((item) => item.categoryId === category.id),
  );
};

/**
 * Busca una categoría por su id.
 */
export const getCatalogCategoryById = (
  categoryId: CatalogCategoryId,
): CatalogCategory | undefined => {
  return CATALOG_CATEGORIES.find((category) => category.id === categoryId);
};

/**
 * Devuelve todos los items implementados.
 */
export const getCatalogItems = (): CatalogItem[] => {
  return [...CATALOG_ITEMS];
};

/**
 * Devuelve los items de una categoría.
 *
 * Ejemplo:
 * categoryId = "comparison-sorting"
 * devuelve:
 * - Bubble Sort
 * - Selection Sort cuando lo implementes
 * - Insertion Sort cuando lo implementes
 */
export const getItemsByCategory = (
  categoryId: CatalogCategoryId,
): CatalogItem[] => {
  return CATALOG_ITEMS.filter((item) => item.categoryId === categoryId);
};

/**
 * Devuelve los items que pertenecen a un dominio.
 *
 * El item no guarda domainId directamente.
 * Se obtiene a través de su categoría:
 *
 * Item → Categoría → Dominio
 */
export const getItemsByDomain = (
  domainId: CatalogDomainId,
): CatalogItem[] => {
  const domainCategoryIds = CATALOG_CATEGORIES
    .filter((category) => category.domainId === domainId)
    .map((category) => category.id);

  return CATALOG_ITEMS.filter((item) =>
    domainCategoryIds.includes(item.categoryId),
  );
};

/**
 * Devuelve los items por tipo.
 *
 * Ejemplo:
 * type = "algorithm"
 * devuelve solo algoritmos.
 */
export const getItemsByType = (
  type: CatalogItemType,
): CatalogItem[] => {
  return CATALOG_ITEMS.filter((item) => item.type === type);
};

/**
 * Busca un item por su id.
 */
export const getCatalogItemById = (
  itemId: CatalogItemId,
): CatalogItem | undefined => {
  return CATALOG_ITEMS.find((item) => item.id === itemId);
};

/**
 * Valida si un string pertenece a los items implementados.
 *
 * Útil cuando recibas ids desde la UI, rutas o stores.
 */
export const isCatalogItemId = (
  itemId: string,
): itemId is CatalogItemId => {
  return CATALOG_ITEMS.some((item) => item.id === itemId);
};