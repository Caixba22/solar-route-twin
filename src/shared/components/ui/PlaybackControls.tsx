// Ruta:
// src/shared/components/ui/PlaybackControls.tsx

/**
 * PlaybackControls
 *
 * Controles visuales de reproducción.
 *
 * Responsabilidades:
 * - Iniciar, pausar y volver a ejecutar el runtime.
 * - Cambiar la velocidad de ejecución.
 * - Mostrar el estado actual.
 *
 * Este componente NO ejecuta algoritmos ni estructuras.
 * Solo modifica useAlgoRuntimeStore.
 *
 * Importante:
 * - Es responsivo.
 * - Evita encimar el botón con la barra de velocidad.
 * - Se reutiliza en algoritmos y estructuras de datos.
 *
 * Mejora móvil:
 * - Solo cuando el botón está en modo Play, desplaza suavemente
 *   hacia el punto indicado por mobileScrollTargetId.
 * - No hace scroll al pausar.
 * - No hace scroll al repetir.
 */

import { useAlgoRuntimeStore } from "../../../store/useAlgoRuntimeStore";
import type { RuntimeStatus } from "../../types/runtime.types";

type PlaybackControlsProps = {
  /**
   * ID del elemento exacto hacia donde se hará scroll en móvil.
   */
  mobileScrollTargetId?: string;

  /**
   * Separación superior para que el contenido no quede pegado
   * al borde superior de la pantalla.
   */
  mobileScrollOffset?: number;
};

const MOBILE_SCROLL_MEDIA_QUERY = "(max-width: 768px)";
const DEFAULT_MOBILE_SCROLL_TARGET_ID = "runtime-view";
const DEFAULT_MOBILE_SCROLL_OFFSET = 16;

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

const getPrimaryButtonLabel = (status: RuntimeStatus): string => {
  if (status === "running") return "Pausar";
  if (status === "finished") return "Repetir";

  return "Play";
};

const getPrimaryButtonIcon = (status: RuntimeStatus): string => {
  if (status === "running") return "⏸";
  if (status === "finished") return "↻";

  return "▶";
};

const isMobileViewport = (): boolean => {
  if (typeof window === "undefined") return false;

  return window.matchMedia(MOBILE_SCROLL_MEDIA_QUERY).matches;
};

const getHTMLElementById = (id: string): HTMLElement | null => {
  if (typeof document === "undefined") return null;

  const element = document.getElementById(id);

  if (!(element instanceof HTMLElement)) return null;

  return element;
};

const getRuntimeScrollTarget = (preferredTargetId: string): HTMLElement | null => {
  if (typeof document === "undefined") return null;

  const preferredElement = getHTMLElementById(preferredTargetId);

  if (preferredElement) return preferredElement;

  const markedElement = document.querySelector(
    "[data-runtime-scroll-target='true']",
  );

  if (markedElement instanceof HTMLElement) {
    return markedElement;
  }

  const canvasElement = document.querySelector("canvas");

  if (canvasElement instanceof HTMLElement) {
    return canvasElement.parentElement ?? canvasElement;
  }

  return null;
};

const scrollToMobileRuntimeView = (
  targetId: string,
  offset: number,
): void => {
  if (typeof window === "undefined") return;
  if (!isMobileViewport()) return;

  const targetElement = getRuntimeScrollTarget(targetId);

  if (!targetElement) return;

  const targetTop =
    targetElement.getBoundingClientRect().top + window.scrollY - offset;

  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  });
};

export const PlaybackControls = ({
  mobileScrollTargetId = DEFAULT_MOBILE_SCROLL_TARGET_ID,
  mobileScrollOffset = DEFAULT_MOBILE_SCROLL_OFFSET,
}: PlaybackControlsProps) => {
  const status = useAlgoRuntimeStore((state) => state.status);
  const speed = useAlgoRuntimeStore((state) => state.speed);
  const play = useAlgoRuntimeStore((state) => state.play);
  const pause = useAlgoRuntimeStore((state) => state.pause);
  const reset = useAlgoRuntimeStore((state) => state.reset);
  const setSpeed = useAlgoRuntimeStore((state) => state.setSpeed);

  const isRunning = status === "running";
  const isFinished = status === "finished";

  const scrollAfterPlay = (): void => {
    window.setTimeout(() => {
      scrollToMobileRuntimeView(mobileScrollTargetId, mobileScrollOffset);
    }, 80);
  };

  const handlePrimaryAction = () => {
    if (isRunning) {
      pause();
      return;
    }

    /**
     * Repetir NO hace scroll.
     */
    if (isFinished) {
      reset();

      window.setTimeout(() => {
        play();
      }, 0);

      return;
    }

    /**
     * Solo Play hace scroll.
     */
    play();
    scrollAfterPlay();
  };

  const handleSpeedChange = (value: string) => {
    const numericSpeed = Number(value);

    if (!Number.isFinite(numericSpeed)) return;

    setSpeed(numericSpeed);
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrimaryAction}
            className={[
              "flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl",
              "bg-algo-accent px-4 text-white shadow-lg transition",
              "hover:opacity-80 active:scale-95 sm:min-h-12",
            ].join(" ")}
            aria-label={getPrimaryButtonLabel(status)}
            title={getPrimaryButtonLabel(status)}
          >
            <span className="text-lg font-black sm:text-xl">
              {getPrimaryButtonIcon(status)}
            </span>

            <span className="text-xs font-black uppercase tracking-wider">
              {getPrimaryButtonLabel(status)}
            </span>
          </button>

          <div
            className={[
              "flex min-w-[132px] max-w-full flex-1 items-center justify-center gap-2 rounded-lg border bg-surface px-3 py-2",
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

            <span className="min-w-0 truncate text-xs font-bold uppercase tracking-wider text-text-primary">
              {getStatusLabel(status)}
            </span>
          </div>
        </div>

        <div className="w-full min-w-0">
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
      </div>
    </div>
  );
};