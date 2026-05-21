// Ruta:
// src/shared/constants/applyThemeVars.ts

/**
 * applyThemeVars
 *
 * Aplica los valores de ALGO_THEME como variables CSS globales.
 *
 * Esto permite usar los colores del tema desde Tailwind/CSS
 * sin duplicar valores.
 */

import { ALGO_THEME } from "./theme";

export const applyThemeVars = () => {
  const root = document.documentElement;

  root.style.setProperty("--algo-data-background", ALGO_THEME.data.background);
  root.style.setProperty("--algo-data-default", ALGO_THEME.data.default);
  root.style.setProperty("--algo-data-active", ALGO_THEME.data.active);
  root.style.setProperty("--algo-data-comparing", ALGO_THEME.data.comparing);
  root.style.setProperty("--algo-data-sorted", ALGO_THEME.data.sorted);
  root.style.setProperty("--algo-data-critical", ALGO_THEME.data.critical);
  root.style.setProperty("--algo-data-pivot", ALGO_THEME.data.pivot);
  root.style.setProperty("--algo-data-boundary", ALGO_THEME.data.boundary);

  root.style.setProperty("--algo-scene-background", ALGO_THEME.scene.background);
  root.style.setProperty(
    "--algo-scene-sorting-backdrop",
    ALGO_THEME.scene.sortingBackdrop,
  );
  root.style.setProperty(
    "--algo-scene-sorting-backdrop-border",
    ALGO_THEME.scene.sortingBackdropBorder,
  );
  root.style.setProperty(
    "--algo-scene-sorting-backdrop-grid",
    ALGO_THEME.scene.sortingBackdropGrid,
  );

  root.style.setProperty("--algo-ui-surface", ALGO_THEME.ui.surface);
  root.style.setProperty("--algo-ui-surface-hover", ALGO_THEME.ui.surfaceHover);
  root.style.setProperty("--algo-ui-border", ALGO_THEME.ui.border);
  root.style.setProperty("--algo-ui-text-primary", ALGO_THEME.ui.textPrimary);
  root.style.setProperty("--algo-ui-text-secondary", ALGO_THEME.ui.textSecondary);
  root.style.setProperty("--algo-ui-accent", ALGO_THEME.ui.accent);
};