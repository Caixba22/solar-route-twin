// Ruta:
// src/shared/components/ui/PlaybackControls.tsx

/**
 * PlaybackControls
 *
 * Controles visuales de reproducción.
 *
 * Responsabilidades:
 * - Iniciar, pausar y reiniciar el runtime.
 * - Cambiar la velocidad de ejecución.
 * - Mostrar el estado actual.
 *
 * Este componente NO ejecuta algoritmos ni estructuras.
 * Solo modifica useAlgoRuntimeStore.
 *
 * Importante:
 * - Es responsivo.
 * - En móvil permite que los controles bajen a varias líneas.
 * - Se reutiliza en algoritmos y estructuras de datos.
 */

import { useAlgoRuntimeStore } from "../../../store/useAlgoRuntimeStore";
import type { RuntimeStatus } from "../../types/runtime.types";

const getStatusLabel = (status: RuntimeStatus): string => {
  if (status === "running") return "Ejecutando";
  if (status === "paused") return "Pausado";
  if (status === "finished") return "Finalizado";

  return "En espera";
};

const getStatusColorClass = (status: RuntimeStatus): string => {
  if (status === "running") return "bg-data-active";
  if (status === "paused") return "bg-data-comparing";
  if (status === "finished") return "bg-data-sorted";

  return "bg-text-secondary";
};

const getStatusBorderClass = (status: RuntimeStatus): string => {
  if (status === "running") return "border-data-active";
  if (status === "paused") return "border-data-comparing";
  if (status === "finished") return "border-data-sorted";

  return "border-algo-border";
};

export const PlaybackControls = () => {
  const status = useAlgoRuntimeStore((state) => state.status);
  const speed = useAlgoRuntimeStore((state) => state.speed);
  const play = useAlgoRuntimeStore((state) => state.play);
  const pause = useAlgoRuntimeStore((state) => state.pause);
  const reset = useAlgoRuntimeStore((state) => state.reset);
  const setSpeed = useAlgoRuntimeStore((state) => state.setSpeed);

  const isRunning = status === "running";
  const isIdle = status === "idle";
  const isFinished = status === "finished";

  const handlePrimaryAction = () => {
    if (isRunning) {
      pause();
      return;
    }

    /**
     * Si ya terminó, reiniciamos antes de volver a ejecutar.
     *
     * Esto evita que el botón quede inutilizable cuando status === "finished".
     */
    if (isFinished) {
      reset();
    }

    play();
  };

  const handleSpeedChange = (value: string) => {
    const numericSpeed = Number(value);

    if (!Number.isFinite(numericSpeed)) return;

    setSpeed(numericSpeed);
  };

  return (
    <div className="w-full min-w-0">
      <div className="grid w-full min-w-0 gap-3 sm:grid-cols-[auto_minmax(160px,1fr)_auto] sm:items-center">
        {/* Botones principales */}
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-algo-accent text-white shadow-lg transition hover:opacity-80 active:scale-95 sm:size-12"
            aria-label={isRunning ? "Pausar visualización" : "Iniciar visualización"}
            title={isRunning ? "Pausar" : isFinished ? "Reiniciar y reproducir" : "Reproducir"}
          >
            <span className="text-lg font-black sm:text-xl">
              {isRunning ? "⏸" : isFinished ? "↻" : "▶"}
            </span>
          </button>

          <button
            type="button"
            onClick={reset}
            disabled={isIdle}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-algo-border bg-surface-hover text-text-secondary transition hover:text-text-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:size-12"
            aria-label="Reiniciar visualización"
            title="Reiniciar"
          >
            <span className="text-lg font-black sm:text-xl">⟲</span>
          </button>
        </div>

        {/* Control de velocidad */}
        <div className="min-w-0">
          <div className="mb-1 flex items-center justify-between gap-3">
            <label
              htmlFor="speed-slider"
              className="truncate text-xs font-bold text-text-secondary"
            >
              Velocidad
            </label>

            <span className="shrink-0 font-mono text-xs font-bold text-text-primary">
              {speed}x
            </span>
          </div>

          <input
            id="speed-slider"
            type="range"
            min="1"
            max="8"
            step="1"
            value={speed}
            onChange={(event) => handleSpeedChange(event.target.value)}
            className="h-2 w-full min-w-0 cursor-pointer accent-algo-accent"
          />
        </div>

        {/* Indicador de estado */}
        <div
          className={[
            "flex min-w-0 items-center justify-center gap-2 rounded-lg border bg-surface px-3 py-2",
            getStatusBorderClass(status),
          ].join(" ")}
        >
          <span
            className={[
              "size-2.5 shrink-0 rounded-full",
              getStatusColorClass(status),
              status === "running" ? "animate-pulse" : "",
            ].join(" ")}
          />

          <span className="truncate text-xs font-bold uppercase tracking-wider text-text-primary">
            {getStatusLabel(status)}
          </span>
        </div>
      </div>
    </div>
  );
};