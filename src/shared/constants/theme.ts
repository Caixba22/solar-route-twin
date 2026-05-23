// Ruta:
// src/shared/constants/theme.ts

export const ALGO_THEME = {
  data: {
    background: "#020617",

    default: "#cbd5e1",

    active: "#64748b",

    comparing: "#fbbf24",

    sorted: "#34d399",

    critical: "#fb7185",

    pivot: "#e2e8f0",

    boundary: "#f8fafc",
  },

  scene: {
    background: "#020617",

    sortingBackdrop: "#070b12",

    sortingBackdropBorder: "#475569",

    sortingBackdropGrid: "#1f2937",
  },

  ui: {
    surface: "#020617",
    surfaceHover: "#111827",
    border: "#475569",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    accent: "#64748b",
  },

  engine: {
    glowIntensity: 1.08,
    bloomThreshold: 0.91,
    gridColor: "#334155",
  },
} as const;

export type AlgoTheme = typeof ALGO_THEME;