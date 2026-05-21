// Ruta:
// src/shared/constants/theme.ts

/**
 * ALGO_THEME
 *
 * Fuente única de verdad visual para VertexNodes.
 *
 * Importante:
 * - No hardcodear colores en componentes.
 * - Las barras 3D toman colores desde ALGO_THEME.data.
 * - La escena toma colores desde ALGO_THEME.scene.
 * - La interfaz toma colores desde ALGO_THEME.ui.
 */

export const ALGO_THEME = {
  data: {
    background: "#020617",

    // Barras normales
    default: "#38bdf8",

    // Estado activo: swaps, movimientos o desplazamientos
    active: "#7c3aed",

    // Comparando elementos
    comparing: "#f59e0b",

    // Elementos ya ordenados
    sorted: "#10b981",

    // Estado crítico general
    critical: "#ef4444",

    // Pivote en algoritmos como Quick Sort
    pivot: "#ec4899",

    // Frontera o índice de partición en algoritmos como Quick Sort
    boundary: "#f8fafc",
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