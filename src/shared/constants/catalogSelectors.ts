// src/shared/constants/catalogSelectors.ts

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


const sortByOrder = <T extends { order: number }>(items: readonly T[]): T[] => {
  return [...items].sort((first, second) => first.order - second.order);
};

export const getCatalogDomains = (): CatalogDomain[] => {
  return sortByOrder(CATALOG_DOMAINS);
};

export const getCatalogDomainById = (
  domainId: CatalogDomainId,
): CatalogDomain | undefined => {
  return CATALOG_DOMAINS.find((domain) => domain.id === domainId);
};

export const getCatalogCategories = (): CatalogCategory[] => {
  return sortByOrder(CATALOG_CATEGORIES);
};

export const getCategoriesByDomain = (
  domainId: CatalogDomainId,
): CatalogCategory[] => {
  return sortByOrder(
    CATALOG_CATEGORIES.filter((category) => category.domainId === domainId),
  );
};

export const getVisibleCategoriesByDomain = (
  domainId: CatalogDomainId,
): CatalogCategory[] => {
  const categories = getCategoriesByDomain(domainId);

  return categories.filter((category) =>
    CATALOG_ITEMS.some((item) => item.categoryId === category.id),
  );
};

export const getCatalogCategoryById = (
  categoryId: CatalogCategoryId,
): CatalogCategory | undefined => {
  return CATALOG_CATEGORIES.find((category) => category.id === categoryId);
};

export const getCatalogItems = (): CatalogItem[] => {
  return [...CATALOG_ITEMS];
};

export const getItemsByCategory = (
  categoryId: CatalogCategoryId,
): CatalogItem[] => {
  return CATALOG_ITEMS.filter((item) => item.categoryId === categoryId);
};

export const getItemsByDomain = (
  domainId: CatalogDomainId,
): CatalogItem[] => {
  const categories = getCategoriesByDomain(domainId);
  const categoryIds = new Set<CatalogCategoryId>(
    categories.map((category) => category.id),
  );

  return CATALOG_ITEMS.filter((item) => categoryIds.has(item.categoryId));
};

export const getItemsByType = (type: CatalogItemType): CatalogItem[] => {
  return CATALOG_ITEMS.filter((item) => item.type === type);
};

export const getCatalogItemById = (
  itemId: CatalogItemId,
): CatalogItem | undefined => {
  return CATALOG_ITEMS.find((item) => item.id === itemId);
};

export const isCatalogItemId = (itemId: string): itemId is CatalogItemId => {
  return CATALOG_ITEMS.some((item) => item.id === itemId);
};