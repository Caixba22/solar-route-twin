// src/pages/home/sections/heroSection/HeroSection.tsx

const HERO_BADGES = [
  "Visualización interactiva",
  "Lógica algorítmica observable",
  "Ejecución controlada paso a paso",
] as const;

const VISUALIZER_ITEMS = [
  {
    label: "Memoria lineal",
    operation: "acceder · insertar · eliminar",
    colorClassName: "bg-data-active",
  },
  {
    label: "Ordenamiento",
    operation: "comparar · mover · confirmar",
    colorClassName: "bg-data-comparing",
  },
  {
    label: "Ejecución",
    operation: "play · pausa · velocidad",
    colorClassName: "bg-data-sorted",
  },
  {
    label: "Estados visuales",
    operation: "activo · resultado · crítico",
    colorClassName: "bg-data-critical",
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

const PREVIEW_BARS = [
  {
    value: 12,
    heightClassName: "h-10 sm:h-12 md:h-14",
    colorClassName: "border-data-active bg-data-active/30",
  },
  {
    value: 7,
    heightClassName: "h-16 sm:h-20 md:h-24",
    colorClassName: "border-data-comparing bg-data-comparing/30",
  },
  {
    value: 30,
    heightClassName: "h-12 sm:h-16 md:h-[4.5rem]",
    colorClassName: "border-algo-border bg-surface",
  },
  {
    value: 5,
    heightClassName: "h-20 sm:h-24 md:h-28",
    colorClassName: "border-data-sorted bg-data-sorted/30",
  },
  {
    value: 18,
    heightClassName: "h-11 sm:h-14 md:h-16",
    colorClassName: "border-algo-border bg-surface",
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
    description: "elementos en revisión o movimiento",
    colorClassName: "bg-data-comparing",
  },
  {
    label: "Resultado",
    description: "valor encontrado, confirmado u ordenado",
    colorClassName: "bg-data-sorted",
  },
  {
    label: "Crítico",
    description: "eliminación, error o no encontrado",
    colorClassName: "bg-data-critical",
  },
] as const;

export const HeroSection = () => (
  <section className="relative flex w-full items-center overflow-hidden px-3 pb-16 pt-24 sm:px-4 sm:pb-20 sm:pt-28 lg:min-h-[76vh]">
    <div className="absolute left-1/2 top-24 h-44 w-44 -translate-x-1/2 rounded-full bg-data-active/20 blur-3xl sm:h-72 sm:w-72" />
    <div className="absolute left-0 top-52 h-40 w-40 rounded-full bg-data-comparing/10 blur-3xl sm:left-10 sm:top-40 sm:h-56 sm:w-56" />
    <div className="absolute bottom-10 right-0 h-44 w-44 rounded-full bg-data-critical/10 blur-3xl sm:right-10 sm:h-64 sm:w-64" />

    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

    <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-10">
      <div className="text-center xl:text-left">
        <div className="mb-5 inline-flex max-w-full rounded-full border border-data-active/50 bg-data-active/10 px-3 py-2 text-center text-[10px] font-mono font-bold uppercase tracking-widest text-data-active backdrop-blur-xl sm:mb-6 sm:px-4 sm:text-xs">
          Visualizador 3D de algoritmos y estructuras de datos
        </div>

        <h1 className="mx-auto mb-5 max-w-5xl text-3xl font-black leading-tight tracking-tighter text-text-primary sm:mb-6 sm:text-5xl lg:text-6xl xl:mx-0 xl:text-7xl">
          Visualiza la lógica interna{" "}
          <span className="text-algo-accent">de cada operación.</span>
        </h1>

        <p className="mx-auto mb-7 max-w-3xl text-sm leading-7 text-text-secondary sm:mb-8 sm:text-base sm:leading-8 md:text-lg xl:mx-0">
          VertexNodes representa estructuras de datos y algoritmos de
          ordenamiento en un entorno 3D interactivo. Observa accesos por índice,
          inserciones, eliminaciones, comparaciones, movimientos y cambios de
          estado sin perder el contexto de los datos.
        </p>

        <div className="flex flex-wrap justify-center gap-2 xl:justify-start">
          {HERO_BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-algo-border bg-surface/80 px-3 py-1.5 text-center font-mono text-[9px] font-bold uppercase tracking-widest text-text-secondary sm:text-[10px]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="absolute -inset-3 rounded-[1.5rem] bg-data-active/10 blur-2xl sm:-inset-4 sm:rounded-[2rem]" />

        <div className="relative overflow-hidden rounded-[1.5rem] border border-algo-border bg-surface/85 p-3 shadow-2xl backdrop-blur-xl sm:rounded-[2rem] sm:p-5">
          <div className="mb-4 flex flex-col items-start gap-3 border-b border-algo-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-widest text-data-active sm:text-[10px]">
                Vista previa
              </p>

              <h2 className="mt-1 text-base font-black text-text-primary sm:text-lg">
                Workspace visual
              </h2>
            </div>

            <span className="rounded-full border border-data-sorted/50 bg-data-sorted/10 px-3 py-1 font-mono text-[8px] font-black uppercase tracking-widest text-data-sorted sm:text-[9px]">
              Listo
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-algo-border bg-data-background/70 p-3 sm:p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-[8px] font-black uppercase tracking-widest text-data-active sm:text-[9px]">
                    Estructuras
                  </p>

                  <h3 className="mt-1 text-sm font-black text-text-primary">
                    Array en memoria
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {PREVIEW_CELLS.map((cell, index) => (
                  <div
                    key={`${cell.value}-${index}`}
                    className="min-w-0 text-center"
                  >
                    <div
                      className={[
                        "flex aspect-square items-center justify-center rounded-lg border",
                        "font-mono text-[10px] font-black shadow-lg sm:rounded-xl sm:text-xs",
                        cell.colorClassName,
                      ].join(" ")}
                    >
                      {cell.value}
                    </div>

                    <span className="mt-1 block font-mono text-[8px] font-bold text-text-secondary sm:text-[9px]">
                      {index}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-center">
                <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-text-secondary">
                  Índice / posición
                </span>
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-algo-border bg-data-background/70 p-3 sm:p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-[8px] font-black uppercase tracking-widest text-data-comparing sm:text-[9px]">
                    Algoritmos
                  </p>

                  <h3 className="mt-1 text-sm font-black text-text-primary">
                    Ordenamiento
                  </h3>
                </div>

                <span className="rounded-full border border-data-comparing/40 bg-data-comparing/10 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-widest text-data-comparing">
                  compare
                </span>
              </div>

              <div className="flex h-32 items-end justify-between gap-1.5 sm:h-36 sm:gap-2 md:h-40">
                {PREVIEW_BARS.map((bar, index) => (
                  <div
                    key={`${bar.value}-${index}`}
                    className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div
                      className={[
                        "w-full rounded-t-lg border shadow-lg sm:rounded-t-xl",
                        bar.heightClassName,
                        bar.colorClassName,
                      ].join(" ")}
                    />

                    <span className="font-mono text-[8px] font-bold text-text-secondary sm:text-[9px]">
                      {index}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-center">
                <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-text-secondary">
                  Índice / posición
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2 2xl:grid-cols-2">
            {VISUALIZER_ITEMS.map((item) => (
              <div
                key={`${item.label}-${item.operation}`}
                className="rounded-2xl border border-algo-border bg-data-background/50 px-3 py-3 sm:px-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={[
                      "size-2.5 shrink-0 rounded-full",
                      item.colorClassName,
                    ].join(" ")}
                  />

                  <span className="truncate font-mono text-[9px] font-black uppercase tracking-widest text-text-secondary sm:text-[10px]">
                    {item.label}
                  </span>
                </div>

                <p className="mt-2 break-words pl-5 font-mono text-[10px] font-bold text-text-primary sm:text-[11px]">
                  {item.operation}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-data-comparing/40 bg-data-comparing/10 px-3 py-3 text-left sm:px-4">
            <p className="font-mono text-[9px] font-black uppercase tracking-widest text-data-comparing sm:text-[10px]">
              Guía de colores
            </p>

            <div className="mt-3 grid gap-2 xl:grid-cols-2">
              {COLOR_GUIDE_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex min-w-0 items-start gap-2 text-[11px] leading-5 text-text-secondary sm:text-xs"
                >
                  <span
                    className={[
                      "mt-1 size-2.5 shrink-0 rounded-full",
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