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

/**
 * Tipos posibles de item.
 */
export type CatalogItemType = "data-structure" | "algorithm";

/**
 * Forma base de un dominio.
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
 * Tipos derivados automáticamente desde CATALOG_DOMAINS.
 */
export type CatalogDomain = (typeof CATALOG_DOMAINS)[number];
export type CatalogDomainId = CatalogDomain["id"];

/**
 * Forma base de una categoría.
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
 */
export const CATALOG_CATEGORIES = [
  {
    id: "linear-memory",
    domainId: "data-structures",
    title: "Memoria lineal",
    description:
      "Estructuras secuenciales organizadas por posición, enlace o flujo.",
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
    description:
      "Estructuras compactas para pertenencia aproximada o estimaciones.",
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
    description:
      "Algoritmos no comparativos basados en conteo, claves o agrupación.",
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
 * Tipos derivados automáticamente desde CATALOG_CATEGORIES.
 */
export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];
export type CatalogCategoryId = CatalogCategory["id"];

/**
 * Forma base de un item del catálogo.
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
 * Importante:
 * Si aparece aquí, debe tener visualización conectada.
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
  {
    id: "selection-sort",
    name: "Selection Sort",
    type: "algorithm",
    categoryId: "comparison-sorting",
    description:
      "Ordenamiento por selección del menor elemento en cada pasada.",
    complexity: "O(n²)",
    tags: ["ordenamiento", "comparación", "selección"],
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    type: "algorithm",
    categoryId: "comparison-sorting",
    description:
      "Ordenamiento por inserción progresiva dentro de una zona ordenada.",
    complexity: "O(n²)",
    tags: ["ordenamiento", "comparación", "inserción"],
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    type: "algorithm",
    categoryId: "divide-and-conquer-sorting",
    description:
      "Ordenamiento por partición usando un pivote y subarreglos recursivos.",
    complexity: "O(n log n) promedio",
    tags: ["ordenamiento", "comparación", "pivote", "divide y vencerás"],
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    type: "algorithm",
    categoryId: "divide-and-conquer-sorting",
    description:
      "Ordenamiento por división recursiva y fusión ordenada de subarreglos.",
    complexity: "O(n log n)",
    tags: ["ordenamiento", "comparación", "fusión", "divide y vencerás"],
  },
  {
    id: "heap-sort",
    name: "Heap Sort",
    type: "algorithm",
    categoryId: "hybrid-sorting",
    description:
      "Ordenamiento basado en una estructura de heap máximo para extraer elementos en orden.",
    complexity: "O(n log n)",
    tags: ["ordenamiento", "comparación", "heap", "árbol implícito"],
  },
  {
    id: "counting-sort",
    name: "Counting Sort",
    type: "algorithm",
    categoryId: "distribution-sorting",
    description:
      "Ordenamiento no comparativo que cuenta la frecuencia de cada valor y reconstruye el arreglo ordenado.",
    complexity: "O(n + k)",
    tags: ["ordenamiento", "conteo", "distribución", "no comparativo"],
  },
] as const satisfies readonly CatalogItemDefinition[];

/**
 * Tipos derivados automáticamente desde CATALOG_ITEMS.
 */
export type CatalogItem = (typeof CATALOG_ITEMS)[number];
export type CatalogItemId = CatalogItem["id"];

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
 * Algoritmos divide y vencerás:
 * - merge-sort
 *
 * Algoritmos basados en heap:
 * - heap-sort
 *
 * Algoritmos por distribución:
 * - counting-sort
 */