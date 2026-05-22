// Ruta:
// src/pages/home/sections/heroSection/HeroSection.tsx

/**
 * HeroSection
 *
 * Sección principal de bienvenida para VertexNodes.
 *
 * Objetivo:
 * - Presentar la aplicación como un visualizador 3D.
 * - Comunicar de forma clara qué se puede observar dentro del workspace.
 * - Mantener una estética tecnológica sin usar frases vacías o solo decorativas.
 *
 * Mejora visual:
 * - Se mantiene el panel tipo "visor técnico".
 * - Se reemplazan etiquetas técnicas poco claras por mensajes más directos.
 * - Se aclara la lectura de valores e índices del array.
 * - Se reemplaza "Estado visual" por una guía de colores comprensible.
 * - Se eliminan botones de acción para dejar un hero más limpio.
 */

const HERO_BADGES = [
  "Array: insertar · eliminar · buscar",
  "Sorting: comparar · intercambiar · ordenar",
  "Control: play · pausa · velocidad",
] as const;

const VISUALIZER_ITEMS = [
  {
    label: "Array",
    operation: "insert(index, value)",
    colorClassName: "bg-data-active",
  },
  {
    label: "Array",
    operation: "delete(index)",
    colorClassName: "bg-data-critical",
  },
  {
    label: "Ordenamiento",
    operation: "compare(i, j)",
    colorClassName: "bg-data-comparing",
  },
  {
    label: "Control",
    operation: "play · pause · speed",
    colorClassName: "bg-data-sorted",
  },
] as const;

const PREVIEW_CELLS = [
  {
    value: 12,
    colorClassName: "border-data-active bg-data-active/15 text-data-active",
  },
  {
    value: 7,
    colorClassName:
      "border-data-comparing bg-data-comparing/15 text-data-comparing",
  },
  {
    value: 30,
    colorClassName: "border-algo-border bg-surface text-text-primary",
  },
  {
    value: 5,
    colorClassName: "border-data-sorted bg-data-sorted/15 text-data-sorted",
  },
  {
    value: 18,
    colorClassName: "border-algo-border bg-surface text-text-primary",
  },
] as const;

const COLOR_GUIDE_ITEMS = [
  {
    label: "Activo",
    description: "posición que se está usando",
    colorClassName: "bg-data-active",
  },
  {
    label: "Comparando",
    description: "valor en revisión o movimiento",
    colorClassName: "bg-data-comparing",
  },
  {
    label: "Resultado",
    description: "valor encontrado o confirmado",
    colorClassName: "bg-data-sorted",
  },
  {
    label: "Crítico",
    description: "eliminación o caso no encontrado",
    colorClassName: "bg-data-critical",
  },
] as const;

export const HeroSection = () => (
  <section className="relative flex min-h-[76vh] w-full items-center overflow-hidden px-4 pt-24">
    <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-data-active/20 blur-3xl" />
    <div className="absolute left-10 top-40 h-56 w-56 rounded-full bg-data-comparing/10 blur-3xl" />
    <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-data-critical/10 blur-3xl" />

    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

    <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
      <div className="text-center md:text-left">
        <div className="mb-6 inline-flex rounded-full border border-data-active/50 bg-data-active/10 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest text-data-active backdrop-blur-xl">
          Visualizador 3D de algoritmos y estructuras de datos
        </div>

        <h1 className="mb-6 max-w-5xl text-4xl font-black leading-tight tracking-tighter text-text-primary sm:text-5xl md:text-7xl">
          Visualiza la lógica interna{" "}
          <span className="text-algo-accent">de cada operación.</span>
        </h1>

        <p className="mb-8 max-w-3xl text-base leading-8 text-text-secondary md:text-lg">
          VertexNodes representa operaciones sobre estructuras de datos y
          algoritmos de ordenamiento en un entorno 3D interactivo. Visualiza
          comparaciones, accesos por índice, inserciones, eliminaciones y
          cambios de estado sin perder el contexto del arreglo.
        </p>

        <div className="flex flex-wrap justify-center gap-2 md:justify-start">
          {HERO_BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-algo-border bg-surface/80 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-xl">
        <div className="absolute -inset-4 rounded-[2rem] bg-data-active/10 blur-2xl" />

        <div className="relative overflow-hidden rounded-[2rem] border border-algo-border bg-surface/85 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-algo-border pb-4">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-widest text-data-active">
                Vista previa
              </p>

              <h2 className="mt-1 text-lg font-black text-text-primary">
                Array en memoria
              </h2>
            </div>

            <span className="rounded-full border border-data-sorted/50 bg-data-sorted/10 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-data-sorted">
              Listo
            </span>
          </div>

          <div className="rounded-2xl border border-algo-border bg-data-background/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                Valores almacenados
              </span>

              <span className="rounded-full border border-data-comparing/40 bg-data-comparing/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-data-comparing">
                posición i
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {PREVIEW_CELLS.map((cell, index) => (
                <div key={`${cell.value}-${index}`} className="text-center">
                  <div
                    className={[
                      "flex aspect-square items-center justify-center rounded-2xl border",
                      "font-mono text-sm font-black shadow-lg",
                      cell.colorClassName,
                    ].join(" ")}
                  >
                    {cell.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-algo-border bg-surface/50 px-3 py-2">
              <p className="mb-2 font-mono text-[9px] font-black uppercase tracking-widest text-text-secondary">
                Índices del array
              </p>

              <div className="grid grid-cols-5 gap-2">
                {PREVIEW_CELLS.map((cell, index) => (
                  <span
                    key={`index-${cell.value}-${index}`}
                    className="text-center font-mono text-[10px] font-bold text-text-secondary"
                  >
                    {index}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {VISUALIZER_ITEMS.map((item) => (
              <div
                key={`${item.label}-${item.operation}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-algo-border bg-data-background/50 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={[
                      "size-2.5 shrink-0 rounded-full",
                      item.colorClassName,
                    ].join(" ")}
                  />

                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-text-secondary">
                    {item.label}
                  </span>
                </div>

                <span className="truncate font-mono text-xs font-bold text-text-primary">
                  {item.operation}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-data-comparing/40 bg-data-comparing/10 px-4 py-3 text-left">
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-data-comparing">
              Guía de colores
            </p>

            <div className="mt-3 grid gap-2">
              {COLOR_GUIDE_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-xs leading-5 text-text-secondary"
                >
                  <span
                    className={[
                      "size-2.5 shrink-0 rounded-full",
                      item.colorClassName,
                    ].join(" ")}
                  />

                  <span>
                    <strong className="text-text-primary">
                      {item.label}:
                    </strong>{" "}
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);