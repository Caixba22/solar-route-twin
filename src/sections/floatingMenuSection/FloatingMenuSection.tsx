// Ruta aproximada:
// src/sections/floatingMenuSection/FloatingMenuSection.tsx

/**
 * FloatingMenuSection
 *
 * Menú flotante para seleccionar el dominio activo del laboratorio.
 *
 * Ahora usa el catálogo como fuente de verdad:
 * - Los dominios vienen desde catalogSelectors.ts.
 * - Los tipos vienen desde catalog.ts.
 *
 * Así evitamos duplicar textos como:
 * - "Estructuras de datos"
 * - "Algoritmos"
 *
 * Si después cambias un título o descripción en catalog.ts,
 * el menú se actualiza automáticamente.
 */

import { useState } from "react";

import type {
  CatalogAccent,
  CatalogDomainId,
} from "../../shared/constants/catalog";

import { getCatalogDomains } from "../../shared/constants/catalogSelectors";

import { useCatalogSelectionStore } from "../../store/useCatalogSelectionStore";

/**
 * Dominios visibles en el menú.
 *
 * Vienen ordenados desde el selector del catálogo.
 */
const FLOATING_MENU_ITEMS = getCatalogDomains();

/**
 * Devuelve las clases visuales según el acento del dominio.
 *
 * active:
 * - Se usa para Estructuras de datos.
 *
 * comparing:
 * - Se usa para Algoritmos.
 *
 * No usamos clases dinámicas como bg-data-${accent}
 * porque Tailwind puede no detectarlas correctamente.
 */
const getAccentClassNames = (accent: CatalogAccent) => {
  const classes: Record<
    CatalogAccent,
    {
      dot: string;
      iconBackground: string;
      iconRing: string;
      activeBorder: string;
      activeBackground: string;
      activeText: string;
    }
  > = {
    active: {
      dot: "bg-data-active",
      iconBackground: "bg-data-active/15",
      iconRing: "ring-data-active/30",
      activeBorder: "border-data-active",
      activeBackground: "bg-data-active/15",
      activeText: "text-data-active",
    },
    comparing: {
      dot: "bg-data-comparing",
      iconBackground: "bg-data-comparing/15",
      iconRing: "ring-data-comparing/30",
      activeBorder: "border-data-comparing",
      activeBackground: "bg-data-comparing/15",
      activeText: "text-data-comparing",
    },
  };

  return classes[accent];
};

export const FloatingMenuSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const activeDomainId = useCatalogSelectionStore(
    (state) => state.activeDomainId,
  );

  const selectDomain = useCatalogSelectionStore(
    (state) => state.selectDomain,
  );

  /**
   * Dominio actualmente seleccionado.
   *
   * Sirve para pintar el encabezado del menú con el color
   * correspondiente al dominio activo.
   */
  const activeDomain = FLOATING_MENU_ITEMS.find(
    (item) => item.id === activeDomainId,
  );

  const activeAccentClasses = getAccentClassNames(
    activeDomain?.accent ?? "active",
  );

  const handleSelectDomain = (domainId: CatalogDomainId) => {
    selectDomain(domainId);

    document.getElementById("workspace")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setIsOpen(false);
  };

  return (
    <aside className="fixed left-4 right-4 top-24 z-50 pointer-events-auto sm:left-auto sm:right-6 sm:w-80">
      <div className="overflow-hidden rounded-3xl border border-algo-border bg-surface/80 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-surface-hover/80"
          aria-expanded={isOpen}
          aria-controls="floating-domain-panel"
        >
          <div className="flex items-center gap-3">
            <div
              className={[
                "flex h-10 w-10 items-center justify-center rounded-2xl text-algo-accent ring-1",
                activeAccentClasses.iconBackground,
                activeAccentClasses.iconRing,
              ].join(" ")}
            >
              ⬡
            </div>

            <div>
              <p className="text-sm font-bold text-text-primary">
                Tipo de visualización
              </p>
              <p className="text-xs text-text-secondary">
                Elige el laboratorio activo
              </p>
            </div>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-hover text-lg font-black text-algo-accent">
            {isOpen ? "−" : "+"}
          </span>
        </button>

        {isOpen && (
          <nav
            id="floating-domain-panel"
            className="border-t border-algo-border p-3"
          >
            <ul className="flex flex-col gap-2">
              {FLOATING_MENU_ITEMS.map((item) => {
                const isActive = activeDomainId === item.id;
                const accentClasses = getAccentClassNames(item.accent);

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectDomain(item.id)}
                      className={[
                        "group w-full rounded-2xl border px-4 py-3 text-left transition",
                        isActive
                          ? `${accentClasses.activeBorder} ${accentClasses.activeBackground}`
                          : "border-transparent hover:border-algo-border hover:bg-surface-hover",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-1 h-2.5 w-2.5 rounded-full",
                            accentClasses.dot,
                          ].join(" ")}
                        />

                        <div>
                          <p
                            className={[
                              "text-sm font-semibold transition group-hover:text-algo-accent",
                              isActive
                                ? accentClasses.activeText
                                : "text-text-primary",
                            ].join(" ")}
                          >
                            {item.title}
                          </p>

                          <p className="text-xs leading-relaxed text-text-secondary">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </aside>
  );
};