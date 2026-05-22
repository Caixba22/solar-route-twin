// Ruta:
// src/sections/workSpaceSection/DataStructuresWorkspaceSection.tsx

/**
 * DataStructuresWorkspaceSection
 *
 * Workspace visual para estructuras de datos.
 *
 * Responsabilidades:
 * - Mostrar las estructuras de datos disponibles en el catálogo.
 * - Agruparlas por categoría.
 * - Permitir seleccionar una estructura.
 * - Montar la escena 3D correspondiente.
 * - Mostrar controles internos de operación para estructuras como Array.
 * - Mantener diseño responsivo en móvil, tablet y escritorio.
 *
 * Conexión actual:
 * - Si selectedItemId es "array", monta LinearMemoryScene.
 */

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { LinearMemoryScene } from "../../features/dataStructures/linearMemory/scene/LinearMemoryScene";
import { isLinearMemoryStructureId } from "../../features/dataStructures/linearMemory/runtime/useLinearMemoryRunner";

import {
  isArrayOperationId,
  type ArrayOperationId,
  type LinearMemoryOperationConfig,
  type LinearMemoryRuntimeSnapshot,
} from "../../features/dataStructures/linearMemory/types/linearMemory.types";

import { PlaybackControls } from "../../shared/components/ui/PlaybackControls";

import {
  getItemsByCategory,
  getItemsByDomain,
  getVisibleCategoriesByDomain,
  isCatalogItemId,
} from "../../shared/constants/catalogSelectors";

import { useAlgoRuntimeStore } from "../../store/useAlgoRuntimeStore";
import { useCatalogSelectionStore } from "../../store/useCatalogSelectionStore";

const ARRAY_INITIAL_VALUES = [12, 7, 30, 5, 18, 22, 9, 41];

const ARRAY_OPERATION_OPTIONS = [
  {
    id: "traverse",
    label: "Recorrer array",
    description: "Visita las celdas de izquierda a derecha.",
  },
  {
    id: "search",
    label: "Buscar valor",
    description: "Compara celda por celda hasta encontrar el valor.",
  },
  {
    id: "access",
    label: "Acceder por índice",
    description: "Va directamente a la posición indicada.",
  },
] as const satisfies readonly {
  id: ArrayOperationId;
  label: string;
  description: string;
}[];

const ARRAY_LEGEND_ITEMS = [
  {
    label: "Actual",
    description: "posición activa",
    colorVar: "var(--algo-data-active)",
  },
  {
    label: "Comparando",
    description: "valor revisado",
    colorVar: "var(--algo-data-comparing)",
  },
  {
    label: "Encontrado",
    description: "valor localizado",
    colorVar: "var(--algo-data-sorted)",
  },
  {
    label: "No encontrado",
    description: "resultado fallido",
    colorVar: "var(--algo-data-critical)",
  },
  {
    label: "Índice / límite",
    description: "posición o frontera",
    colorVar: "var(--algo-data-boundary)",
  },
] as const;

const getInitialSnapshot = (): LinearMemoryRuntimeSnapshot => {
  return {
    operationLabel: "Recorrer array",
    statusLabel: "En espera",
    description: "Presiona Play para recorrer el array de izquierda a derecha.",
    result: "visiting",
  };
};

const getResultColorVar = (
  result: LinearMemoryRuntimeSnapshot["result"],
): string => {
  if (result === "found") return "var(--algo-data-sorted)";
  if (result === "not-found") return "var(--algo-data-critical)";
  if (result === "accessed") return "var(--algo-data-active)";
  if (result === "comparing") return "var(--algo-data-comparing)";
  if (result === "finished") return "var(--algo-data-sorted)";

  return "var(--algo-data-active)";
};

export const DataStructuresWorkspaceSection = () => {
  const [arrayOperationId, setArrayOperationId] =
    useState<ArrayOperationId>("traverse");

  const [searchTarget, setSearchTarget] = useState<number>(18);
  const [accessIndex, setAccessIndex] = useState<number>(3);

  const [runtimeSnapshot, setRuntimeSnapshot] =
    useState<LinearMemoryRuntimeSnapshot>(getInitialSnapshot);

  const selectedItemId = useCatalogSelectionStore(
    (state) => state.selectedItemId,
  );

  const selectItem = useCatalogSelectionStore((state) => state.selectItem);

  const resetRuntime = useAlgoRuntimeStore((state) => state.reset);

  const dataStructureItems = getItemsByDomain("data-structures");

  const availableCategories = getVisibleCategoriesByDomain("data-structures");

  const selectedItem = dataStructureItems.find(
    (item) => item.id === selectedItemId,
  );

  const hasAvailableItems = dataStructureItems.length > 0;

  const selectedArrayOperation = ARRAY_OPERATION_OPTIONS.find(
    (operation) => operation.id === arrayOperationId,
  );

  const operationConfig = useMemo<LinearMemoryOperationConfig>(
    () => ({
      operationId: arrayOperationId,
      searchTarget,
      accessIndex,
    }),
    [arrayOperationId, searchTarget, accessIndex],
  );

  const handleSelectDataStructure = (itemId: string) => {
    if (!isCatalogItemId(itemId)) return;

    resetRuntime();
    setRuntimeSnapshot(getInitialSnapshot());
    selectItem(itemId);
  };

  const handleSelectArrayOperation = (operationId: string) => {
    if (!isArrayOperationId(operationId)) return;

    resetRuntime();
    setArrayOperationId(operationId);
  };

  const handleSearchTargetChange = (value: string) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) return;

    resetRuntime();
    setSearchTarget(numericValue);
  };

  const handleAccessIndexChange = (value: string) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) return;

    resetRuntime();
    setAccessIndex(numericValue);
  };

  const renderStatusBadge = () => {
    const resultColor = getResultColorVar(runtimeSnapshot.result);

    return (
      <span
        className="inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-text-primary"
        style={{ borderColor: resultColor }}
      >
        <span
          className="mr-1.5 inline-block size-2 rounded-full"
          style={{ backgroundColor: resultColor }}
        />
        {runtimeSnapshot.statusLabel}
      </span>
    );
  };

  const renderRuntimeSummary = (variant: "mobile" | "desktop") => {
    const isMobile = variant === "mobile";

    return (
      <div
        className={[
          "rounded-2xl border border-algo-border bg-data-background/75",
          isMobile ? "p-3" : "p-4",
        ].join(" ")}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-widest text-text-secondary">
              Estado de la operación
            </p>

            <h4 className="mt-1 text-sm font-black text-text-primary">
              {runtimeSnapshot.operationLabel}
            </h4>
          </div>

          {renderStatusBadge()}
        </div>

        <p
          className={[
            "mt-2 break-words text-text-secondary",
            isMobile ? "text-[11px] leading-5" : "text-xs leading-5",
          ].join(" ")}
        >
          {runtimeSnapshot.description}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-text-secondary">
          <div className="rounded-xl border border-algo-border bg-surface/60 px-2 py-1.5">
            <span className="block font-mono uppercase tracking-wider">
              Índice
            </span>
            <span className="mt-0.5 block font-bold text-text-primary">
              {runtimeSnapshot.activeIndex ?? "—"}
            </span>
          </div>

          <div className="rounded-xl border border-algo-border bg-surface/60 px-2 py-1.5">
            <span className="block font-mono uppercase tracking-wider">
              Valor
            </span>
            <span className="mt-0.5 block font-bold text-text-primary">
              {runtimeSnapshot.activeValue ?? "—"}
            </span>
          </div>

          <div className="rounded-xl border border-algo-border bg-surface/60 px-2 py-1.5">
            <span className="block font-mono uppercase tracking-wider">
              Objetivo
            </span>
            <span className="mt-0.5 block font-bold text-text-primary">
              {runtimeSnapshot.targetValue ??
                runtimeSnapshot.accessIndex ??
                "—"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderArrayLegend = () => {
    return (
      <div className="rounded-2xl border border-algo-border bg-surface/85 p-3 shadow-2xl backdrop-blur-md">
        <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-text-secondary">
          Guía visual
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {ARRAY_LEGEND_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-[10px] leading-4 text-text-secondary"
            >
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: item.colorVar }}
              />

              <span>
                <strong className="text-text-primary">{item.label}</strong>{" "}
                <span>{item.description}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderArrayOperationControls = () => {
    if (!selectedItem || selectedItem.id !== "array") return null;

    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="array-operation-select"
            className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-text-secondary"
          >
            Operación
          </label>

          <select
            id="array-operation-select"
            value={arrayOperationId}
            onChange={(event) =>
              handleSelectArrayOperation(event.target.value)
            }
            className="w-full rounded-xl border border-algo-border bg-data-background px-3 py-2 text-xs font-semibold text-text-primary outline-none transition focus:border-data-active"
          >
            {ARRAY_OPERATION_OPTIONS.map((operation) => (
              <option key={operation.id} value={operation.id}>
                {operation.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="array-search-target"
            className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-text-secondary"
          >
            Valor
          </label>

          <input
            id="array-search-target"
            type="number"
            value={searchTarget}
            onChange={(event) =>
              handleSearchTargetChange(event.target.value)
            }
            disabled={arrayOperationId !== "search"}
            className={[
              "w-full rounded-xl border border-algo-border bg-data-background px-3 py-2 text-xs font-semibold text-text-primary outline-none transition focus:border-data-active",
              arrayOperationId !== "search"
                ? "cursor-not-allowed opacity-50"
                : "",
            ].join(" ")}
          />
        </div>

        <div>
          <label
            htmlFor="array-access-index"
            className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-text-secondary"
          >
            Índice
          </label>

          <input
            id="array-access-index"
            type="number"
            min={0}
            max={ARRAY_INITIAL_VALUES.length - 1}
            value={accessIndex}
            onChange={(event) =>
              handleAccessIndexChange(event.target.value)
            }
            disabled={arrayOperationId !== "access"}
            className={[
              "w-full rounded-xl border border-algo-border bg-data-background px-3 py-2 text-xs font-semibold text-text-primary outline-none transition focus:border-data-active",
              arrayOperationId !== "access"
                ? "cursor-not-allowed opacity-50"
                : "",
            ].join(" ")}
          />
        </div>

        {selectedArrayOperation && (
          <p className="col-span-2 text-[11px] leading-5 text-text-secondary sm:col-span-3">
            {selectedArrayOperation.description}
          </p>
        )}
      </div>
    );
  };

  const renderSelectedDataStructureScene = () => {
    if (!selectedItem) {
      return (
        <div className="flex min-h-[420px] items-center justify-center px-6 text-center">
          <p className="text-3xl font-black uppercase tracking-tighter text-text-primary/10 sm:text-4xl md:text-6xl">
            Selecciona una estructura
          </p>
        </div>
      );
    }

    if (isLinearMemoryStructureId(selectedItem.id)) {
      return (
        <div className="flex min-h-[760px] w-full flex-col lg:h-full lg:min-h-0">
          <div className="space-y-2 border-b border-algo-border bg-surface/90 p-2.5 backdrop-blur-md sm:p-3">
            <div className="grid gap-2 xl:grid-cols-[minmax(280px,420px)_minmax(0,1fr)]">
              <div className="rounded-2xl border border-algo-border bg-data-background/60 p-2.5">
                <PlaybackControls />
              </div>

              <div className="rounded-2xl border border-algo-border bg-data-background/60 p-2.5">
                {renderArrayOperationControls()}
              </div>
            </div>

            <div className="xl:hidden">
              {renderRuntimeSummary("mobile")}
            </div>
          </div>

          <div className="relative h-[430px] flex-1 sm:h-[520px] md:h-[600px] lg:h-auto lg:min-h-0">
            <Canvas className="h-full w-full">
              <LinearMemoryScene
                structureId={selectedItem.id}
                values={ARRAY_INITIAL_VALUES}
                operationConfig={operationConfig}
                onRuntimeSnapshotChange={setRuntimeSnapshot}
              />
            </Canvas>

            <div className="absolute left-4 top-4 z-10 hidden xl:block">
              <div className="pointer-events-none w-[420px] rounded-2xl bg-surface/90 shadow-2xl backdrop-blur-md">
                {renderRuntimeSummary("desktop")}
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden xl:block">
              {renderArrayLegend()}
            </div>
          </div>

          <div className="border-t border-algo-border bg-surface/90 p-2.5 xl:hidden">
            <details className="rounded-2xl border border-algo-border bg-data-background/60 p-3">
              <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                Ver guía visual
              </summary>

              <div className="mt-3">{renderArrayLegend()}</div>
            </details>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-[420px] items-center justify-center px-6 text-center">
        <div>
          <p className="text-3xl font-black uppercase tracking-tighter text-text-primary/10 sm:text-4xl md:text-6xl">
            {selectedItem.name}
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-text-secondary">
            Esta estructura está en el catálogo, pero todavía no tiene escena
            3D conectada.
          </p>
        </div>
      </div>
    );
  };

  return (
    <section id="workspace" className="w-full px-3 pb-24 sm:px-6 sm:pb-32">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-algo-border bg-surface p-4 shadow-2xl sm:rounded-[2.5rem] sm:p-8">
        <div className="mb-6 border-b border-algo-border pb-6 sm:mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-data-active">
            Data Structures Workspace
          </p>

          <h2 className="mt-2 text-2xl font-black text-text-primary sm:text-3xl">
            Estructuras de datos
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
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
              value={selectedItem?.id ?? ""}
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
                        {item.complexity ? ` · ${item.complexity}` : ""}
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
            <div className="mt-4 rounded-2xl border border-algo-border bg-data-background/60 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-text-primary">
                    {selectedItem.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {selectedItem.description}
                  </p>
                </div>

                {selectedItem.complexity && (
                  <span className="rounded-full border border-algo-border bg-surface px-3 py-1 font-mono text-[10px] text-text-secondary">
                    {selectedItem.complexity}
                  </span>
                )}
              </div>
            </div>
          )}

          {!hasAvailableItems && (
            <div className="mt-4 rounded-2xl border border-algo-border bg-data-background/60 p-4 sm:p-5">
              <h3 className="font-bold text-text-primary">
                Sin estructuras disponibles todavía
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Este espacio ya está preparado. Cuando agregues items como
                Array, Stack, Queue o Linked List al catálogo, aparecerán
                automáticamente en este selector.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-algo-border bg-data-background sm:rounded-[2rem] lg:h-[720px] xl:h-[760px]">
          {renderSelectedDataStructureScene()}
        </div>
      </div>
    </section>
  );
};