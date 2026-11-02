export const theme = {
  colors: {
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    accent: '#3b82f6',
    accentLight: '#60a5fa',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    bgDeep: '#0a0e1a',
    bgPrimary: '#0f1629',
    bgSecondary: '#1a2137',
    bgTertiary: '#232b42',
    bgCard: '#1e2642',
    bgHover: '#283354',
    border: '#2a3352',
    borderLight: '#374168',
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
  },
  chartColors: [
    '#6366f1', '#3b82f6', '#10b981', '#f59e0b',
    '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
  ],
} as const;

export type Theme = typeof theme;
