// src/sections/floatingMenuSection/FloatingMenuSection.tsx

import { useState } from "react";

import type {
  CatalogAccent,
  CatalogDomainId,
} from "../../shared/constants/catalog";

import { getCatalogDomains } from "../../shared/constants/catalogSelectors";

import { useCatalogSelectionStore } from "../../store/useCatalogSelectionStore";

const FLOATING_MENU_ITEMS = getCatalogDomains();

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
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  const activeDomainId = useCatalogSelectionStore(
    (state) => state.activeDomainId,
  );

  const selectDomain = useCatalogSelectionStore((state) => state.selectDomain);

  const activeDomain =
    FLOATING_MENU_ITEMS.find((domain) => domain.id === activeDomainId) ??
    FLOATING_MENU_ITEMS[0];

  const activeAccentClasses = getAccentClassNames(
    activeDomain?.accent ?? "active",
  );

  const showMobileMenu = () => {
    setIsMobileMenuVisible(true);
    setIsOpen(true);
  };

  const hideMobileMenu = () => {
    setIsMobileMenuVisible(false);
    setIsOpen(false);
  };

  const handleTogglePanel = () => {
    setIsOpen((current) => !current);
  };

  const handleSelectDomain = (domainId: CatalogDomainId) => {
    selectDomain(domainId);

    document.getElementById("workspace")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setIsOpen(false);
    setIsMobileMenuVisible(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={showMobileMenu}
        className={[
          "pointer-events-auto fixed right-4 top-24 z-[60] sm:hidden",
          "flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full",
          "border border-algo-border bg-surface/90 px-3 py-2",
          "text-xs font-black uppercase tracking-widest text-text-primary",
          "shadow-2xl backdrop-blur-xl transition",
          "hover:bg-surface-hover active:scale-95",
          isMobileMenuVisible ? "opacity-0 pointer-events-none" : "opacity-100",
        ].join(" ")}
        aria-label="Mostrar menú de dominios"
        title="Mostrar menú"
      >
        <span
          className={[
            "size-2.5 shrink-0 rounded-full",
            activeAccentClasses.dot,
          ].join(" ")}
        />

        <span className="min-w-0 truncate">
          {activeDomain?.title ?? "Menú"}
        </span>

        <span className="shrink-0 text-algo-accent">☰</span>
      </button>

      {isMobileMenuVisible && (
        <button
          type="button"
          onClick={hideMobileMenu}
          className="fixed inset-0 z-40 bg-background/10 backdrop-blur-[1px] sm:hidden"
          aria-label="Cerrar menú de dominios"
          title="Cerrar menú"
        />
      )}

      <aside
        className={[
          "pointer-events-none fixed left-4 right-4 top-24 z-50",
          "transition-all duration-300 ease-out",
          "sm:left-auto sm:right-6 sm:w-80",
          isMobileMenuVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-[calc(100%+7rem)] opacity-0 sm:translate-y-0 sm:opacity-100",
        ].join(" ")}
      >
        <div className="pointer-events-auto overflow-hidden rounded-3xl border border-algo-border bg-surface/90 shadow-2xl backdrop-blur-xl">
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={handleTogglePanel}
              className={[
                "flex min-w-0 flex-1 items-center justify-between gap-3",
                "px-4 py-3 text-left transition sm:px-5 sm:py-4",
                "hover:bg-surface-hover/80 active:scale-[0.99]",
                isOpen ? "bg-surface-hover/50" : "",
              ].join(" ")}
              aria-expanded={isOpen}
              aria-controls="floating-domain-panel"
              aria-label={
                isOpen
                  ? "Cerrar opciones de dominios"
                  : "Abrir opciones de dominios"
              }
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1",
                    activeAccentClasses.iconBackground,
                    activeAccentClasses.iconRing,
                    activeAccentClasses.activeText,
                  ].join(" ")}
                >
                  ⬡
                </div>

                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                    Modo de visualización
                  </p>

                  <p
                    className={[
                      "mt-0.5 truncate text-sm font-black",
                      activeAccentClasses.activeText,
                    ].join(" ")}
                  >
                    {activeDomain?.title ?? "Selecciona un dominio"}
                  </p>
                </div>
              </div>

              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                  "bg-surface-hover text-lg font-black text-algo-accent",
                  "transition-transform",
                  isOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
                aria-hidden="true"
              >
                ˅
              </span>
            </button>

            <button
              type="button"
              onClick={hideMobileMenu}
              className={[
                "flex w-12 shrink-0 items-center justify-center border-l border-algo-border",
                "bg-surface/60 text-xl font-black text-text-secondary transition",
                "hover:bg-surface-hover hover:text-text-primary active:scale-95",
                "sm:hidden",
              ].join(" ")}
              aria-label="Ocultar menú"
              title="Ocultar menú"
            >
              ×
            </button>
          </div>

          {isOpen && (
            <nav
              id="floating-domain-panel"
              className="border-t border-algo-border p-3"
            >
              <ul className="flex flex-col gap-2">
                {FLOATING_MENU_ITEMS.map((domain) => {
                  const isActive = activeDomainId === domain.id;
                  const accentClasses = getAccentClassNames(domain.accent);

                  return (
                    <li key={domain.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectDomain(domain.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "group w-full rounded-2xl border px-4 py-3 text-left transition",
                          "hover:border-algo-border hover:bg-surface-hover active:scale-[0.99]",
                          isActive
                            ? `${accentClasses.activeBorder} ${accentClasses.activeBackground}`
                            : "border-transparent",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={[
                              "h-2.5 w-2.5 shrink-0 rounded-full",
                              accentClasses.dot,
                              isActive ? "animate-pulse" : "",
                            ].join(" ")}
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={[
                                  "truncate text-sm font-black transition group-hover:text-algo-accent",
                                  isActive
                                    ? accentClasses.activeText
                                    : "text-text-primary",
                                ].join(" ")}
                              >
                                {domain.title}
                              </p>

                              {isActive && (
                                <span
                                  className={[
                                    "shrink-0 rounded-full border px-2 py-0.5",
                                    "font-mono text-[8px] font-black uppercase tracking-widest",
                                    accentClasses.activeBorder,
                                    accentClasses.activeText,
                                  ].join(" ")}
                                >
                                  activo
                                </span>
                              )}
                            </div>
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
    </>
  );
};