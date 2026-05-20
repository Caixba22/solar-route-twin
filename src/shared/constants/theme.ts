// src/shared/constants/theme.ts

export const ALGO_THEME = {
  data: {
    background: "#020617",

    // Barras normales
    default: "#38bdf8",

    // Estado activo
    active: "#7c3aed",

    // Comparando
    comparing: "#f59e0b",

    // Ordenado
    sorted: "#10b981",

    // Crítico
    critical: "#ef4444",
  },

  scene: {
    // Fondo general del Canvas
    background: "#020617",

    // Fondo detrás de las barras: grafito azulado, más claro que el Canvas
    sortingBackdrop: "#111827",

    // Borde del panel
    sortingBackdropBorder: "#475569",

    // Color sutil para piso o líneas
    sortingBackdropGrid: "#334155",
  },

  ui: {
    surface: "#020617",
    surfaceHover: "#111827",
    border: "#334155",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    accent: "#7c3aed",
  },

  engine: {
    glowIntensity: 1.25,
    bloomThreshold: 0.86,
    gridColor: "#334155",
  },
} as const;

export type AlgoTheme = typeof ALGO_THEME;