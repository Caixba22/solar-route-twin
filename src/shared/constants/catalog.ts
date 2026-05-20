// Ruta:
// src/shared/constants/catalog.ts

/**
 * Catálogo principal de VertexNodes.
 *
 * Este archivo es la fuente única de verdad para:
 * - Dominios principales del sistema.
 * - Categorías internas.
 * - Items implementados: algoritmos o estructuras.
 * - Tipos derivados automáticamente desde los datos reales.
 *
 * Regla importante:
 * - Si un item está dentro de CATALOG_ITEMS, ya debe poder visualizarse.
 * - Si todavía no está implementado, déjalo solo como comentario guía.
 */

export type CatalogAccent = "active" | "comparing";

export type CatalogItemType = "data-structure" | "algorithm";

/**
 * Forma base de un dominio.
 *
 * El dominio representa el primer nivel del catálogo.
 * Por ejemplo:
 * - Estructuras de datos
 * - Algoritmos
 */
type CatalogDomainDefinition = {
  id: string;
  title: string;
  description: string;
  accent: CatalogAccent;
  order: number;
};

/**
 * Dominios principales del laboratorio.
 *
 * Estos datos pueden usarse directamente en el menú flotante,
 * porque contienen el título, la descripción y el acento visual.
 */
export const CATALOG_DOMAINS = [
  {
    id: "data-structures",
    title: "Estructuras de datos",
    description: "Visualizar memoria, nodos, árboles y grafos.",
    accent: "active",
    order: 1,
  },
  {
    id: "algorithms",
    title: "Algoritmos",
    description: "Visualizar ordenamientos y procesos paso a paso.",
    accent: "comparing",
    order: 2,
  },
] as const satisfies readonly CatalogDomainDefinition[];

/**
 * ID válido de dominio.
 *
 * Se genera automáticamente desde CATALOG_DOMAINS.
 * Así evitas escribir manualmente:
 * "data-structures" | "algorithms"
 */
export type CatalogDomainId = (typeof CATALOG_DOMAINS)[number]["id"];

export type CatalogDomain = {
  id: CatalogDomainId;
  title: string;
  description: string;
  accent: CatalogAccent;
  order: number;
};

/**
 * Forma base de una categoría.
 *
 * Cada categoría pertenece a un dominio mediante domainId.
 */
type CatalogCategoryDefinition = {
  id: string;
  domainId: CatalogDomainId;
  title: string;
  description: string;
  order: number;
};

/**
 * Categorías internas del catálogo.
 *
 * Relación:
 * Dominio → Categoría
 *
 * Ejemplo:
 * Algoritmos → Ordenamiento por comparación
 */
export const CATALOG_CATEGORIES = [
  {
    id: "linear-memory",
    domainId: "data-structures",
    title: "Memoria lineal",
    description: "Estructuras secuenciales organizadas por posición, enlace o flujo.",
    order: 1,
  },
  {
    id: "tree-systems",
    domainId: "data-structures",
    title: "Árboles y jerarquías",
    description: "Estructuras ramificadas con relaciones padre-hijo.",
    order: 2,
  },
  {
    id: "graph-systems",
    domainId: "data-structures",
    title: "Grafos y redes",
    description: "Sistemas de nodos conectados mediante aristas.",
    order: 3,
  },
  {
    id: "associative-memory",
    domainId: "data-structures",
    title: "Memoria asociativa",
    description: "Estructuras basadas en llaves, mapeo y búsqueda rápida.",
    order: 4,
  },
  {
    id: "probabilistic-structures",
    domainId: "data-structures",
    title: "Estructuras probabilísticas",
    description: "Estructuras compactas para pertenencia aproximada o estimaciones.",
    order: 5,
  },
  {
    id: "advanced-structures",
    domainId: "data-structures",
    title: "Estructuras avanzadas",
    description: "Estructuras especializadas para escenarios de mayor complejidad.",
    order: 6,
  },
  {
    id: "comparison-sorting",
    domainId: "algorithms",
    title: "Ordenamiento por comparación",
    description: "Algoritmos que ordenan comparando elementos entre sí.",
    order: 10,
  },
  {
    id: "divide-and-conquer-sorting",
    domainId: "algorithms",
    title: "Ordenamiento por división",
    description: "Algoritmos que dividen el problema en partes más pequeñas.",
    order: 11,
  },
  {
    id: "distribution-sorting",
    domainId: "algorithms",
    title: "Ordenamiento por distribución",
    description: "Algoritmos no comparativos basados en conteo, claves o agrupación.",
    order: 12,
  },
  {
    id: "hybrid-sorting",
    domainId: "algorithms",
    title: "Ordenamiento híbrido",
    description: "Algoritmos que combinan varias estrategias de ordenamiento.",
    order: 13,
  },
  {
    id: "graph-traversal",
    domainId: "algorithms",
    title: "Recorridos en grafos",
    description: "Algoritmos para explorar redes de nodos.",
    order: 14,
  },
  {
    id: "pathfinding",
    domainId: "algorithms",
    title: "Búsqueda de caminos",
    description: "Algoritmos para encontrar rutas posibles u óptimas.",
    order: 15,
  },
  {
    id: "tree-operations",
    domainId: "algorithms",
    title: "Operaciones sobre árboles",
    description: "Procesos de inserción, búsqueda, recorrido y balanceo.",
    order: 16,
  },
] as const satisfies readonly CatalogCategoryDefinition[];

/**
 * ID válido de categoría.
 *
 * Se genera automáticamente desde CATALOG_CATEGORIES.
 * Así evitas errores cuando cambias un id como:
 * "sorting-basics" → "comparison-sorting"
 */
export type CatalogCategoryId = (typeof CATALOG_CATEGORIES)[number]["id"];

export type CatalogCategory = {
  id: CatalogCategoryId;
  domainId: CatalogDomainId;
  title: string;
  description: string;
  order: number;
};

/**
 * Forma base de un item del catálogo.
 *
 * Un item puede ser:
 * - una estructura de datos
 * - un algoritmo
 *
 * Cada item se conecta a una categoría mediante categoryId.
 */
type CatalogItemDefinition = {
  id: string;
  name: string;
  type: CatalogItemType;
  categoryId: CatalogCategoryId;
  description: string;
  complexity?: string;
  tags?: readonly string[];
};

/**
 * Items actualmente implementados.
 *
 * Relación:
 * Dominio → Categoría → Item
 *
 * Ejemplo:
 * Algoritmos → Ordenamiento por comparación → Bubble Sort
 */
export const CATALOG_ITEMS = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    type: "algorithm",
    categoryId: "comparison-sorting",
    description: "Ordenamiento por comparación adyacente.",
    complexity: "O(n²)",
    tags: ["ordenamiento", "comparación", "adyacente"],
  },
] as const satisfies readonly CatalogItemDefinition[];

/**
 * ID válido de item.
 *
 * Se genera automáticamente desde CATALOG_ITEMS.
 * Cuando agregues selection-sort, insertion-sort, etc.,
 * el tipo se actualizará solo.
 */
export type CatalogItemId = (typeof CATALOG_ITEMS)[number]["id"];

export type CatalogItem = {
  id: CatalogItemId;
  name: string;
  type: CatalogItemType;
  categoryId: CatalogCategoryId;
  description: string;
  complexity?: string;
  tags?: readonly string[];
};

/**
 * Próximos elementos a implementar:
 *
 * Estructuras de datos:
 * - array
 * - stack
 * - queue
 * - linked-list
 * - binary-search-tree
 * - heap
 * - graph-basic
 *
 * Algoritmos de ordenamiento por comparación:
 * - selection-sort
 * - insertion-sort
 *
 * Algoritmos divide y vencerás:
 * - quick-sort
 * - merge-sort
 *
 * Algoritmos basados en heap:
 * - heap-sort
 *
 * Algoritmos por distribución:
 * - counting-sort
 */