// Ruta:
// src/sections/workSpaceSection/DataStructuresWorkspaceSection.tsx

/**
 * DataStructuresWorkspaceSection
 *
 * Workspace visual para estructuras de datos.
 *
 * Responsabilidad:
 * - Mostrar las estructuras de datos disponibles en el catálogo.
 * - Agruparlas por categoría.
 * - Permitir seleccionar una estructura.
 * - Mostrar una vista temporal mientras se implementan sus escenas 3D.
 *
 * Importante:
 * - Ya no importa CATALOG_ITEMS ni CATALOG_CATEGORIES directamente.
 * - Usa catalogSelectors.ts para consultar el catálogo.
 * - Si no hay estructuras implementadas todavía, muestra un estado vacío.
 * - isCatalogItemId valida que el valor del select sea un item real.
 */

import {
  getItemsByDomain,
  getItemsByCategory,
  getVisibleCategoriesByDomain,
  isCatalogItemId,
} from "../../shared/constants/catalogSelectors";

import { useCatalogSelectionStore } from "../../store/useCatalogSelectionStore";

export const DataStructuresWorkspaceSection = () => {
  const selectedItemId = useCatalogSelectionStore(
    (state) => state.selectedItemId,
  );

  const selectItem = useCatalogSelectionStore(
    (state) => state.selectItem,
  );

  /**
   * Obtiene todos los items pertenecientes al dominio:
   * "data-structures".
   *
   * Actualmente puede venir vacío porque todavía no has agregado
   * estructuras de datos reales al catálogo.
   */
  const dataStructureItems = getItemsByDomain("data-structures");

  /**
   * Obtiene solo las categorías de estructuras de datos
   * que ya tienen al menos un item implementado.
   *
   * Esto evita mostrar categorías vacías.
   */
  const availableCategories = getVisibleCategoriesByDomain("data-structures");

  /**
   * Busca el item seleccionado dentro de las estructuras disponibles.
   */
  const selectedItem = dataStructureItems.find(
    (item) => item.id === selectedItemId,
  );

  const hasAvailableItems = dataStructureItems.length > 0;

  const handleSelectDataStructure = (itemId: string) => {
    /**
     * El value de un select siempre llega como string.
     * isCatalogItemId confirma que ese string existe realmente
     * dentro de CATALOG_ITEMS.
     */
    if (!isCatalogItemId(itemId)) return;

    selectItem(itemId);
  };

  return (
    <section className="w-full px-6 pb-32">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-algo-border bg-surface p-8 shadow-2xl">
        <div className="mb-8 border-b border-algo-border pb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-data-active">
            Data Structures Workspace
          </p>

          <h2 className="mt-2 text-3xl font-black text-text-primary">
            Estructuras de datos
          </h2>

          <p className="mt-3 max-w-2xl text-text-secondary">
            Selecciona una estructura para visualizar su comportamiento en el
            espacio 3D.
          </p>
        </div>

        <div className="max-w-xl">
          <label
            htmlFor="data-structure-select"
            className="mb-3 block text-sm font-bold text-text-primary"
          >
            Tipo de estructura
          </label>

          <div className="relative">
            <select
              id="data-structure-select"
              value={selectedItemId ?? ""}
              onChange={(event) =>
                handleSelectDataStructure(event.target.value)
              }
              disabled={!hasAvailableItems}
              className={[
                "w-full appearance-none rounded-2xl border border-algo-border bg-data-background px-5 py-4 pr-12 text-sm font-semibold text-text-primary outline-none transition focus:border-data-active",
                hasAvailableItems
                  ? "hover:bg-surface-hover"
                  : "cursor-not-allowed opacity-60",
              ].join(" ")}
            >
              <option value="" disabled>
                {hasAvailableItems
                  ? "Selecciona una estructura"
                  : "Aún no hay estructuras implementadas"}
              </option>

              {availableCategories.map((category) => {
                const categoryItems = getItemsByCategory(category.id);

                return (
                  <optgroup key={category.id} label={category.title}>
                    {categoryItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>

            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-algo-accent">
              ▼
            </span>
          </div>

          {selectedItem && (
            <div className="mt-4 rounded-2xl border border-algo-border bg-data-background/60 p-5">
              <h3 className="font-bold text-text-primary">
                {selectedItem.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {selectedItem.description}
              </p>
            </div>
          )}

          {!hasAvailableItems && (
            <div className="mt-4 rounded-2xl border border-algo-border bg-data-background/60 p-5">
              <h3 className="font-bold text-text-primary">
                Sin estructuras disponibles todavía
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Este espacio ya está preparado. Cuando agregues items como Array,
                Stack, Queue o Linked List al catálogo, aparecerán automáticamente
                en este selector.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 aspect-video overflow-hidden rounded-[2rem] border border-algo-border bg-data-background">
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <p className="text-4xl font-black uppercase tracking-tighter text-text-primary/10 md:text-6xl">
                {selectedItem?.name ?? "Estructuras de datos"}
              </p>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-text-secondary">
                {selectedItem
                  ? selectedItem.description
                  : "Aquí se mostrará la visualización 3D cuando selecciones una estructura implementada."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};