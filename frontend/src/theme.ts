import type {ThemeConfig} from 'antd';
import {theme as antdTheme} from 'antd';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

const semanticTokens = {
  light: {
    bgPage: '#f5f7fb',
    bgContainer: '#ffffff',
    bgElevated: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textTertiary: '#6b7280',
    border: '#d9e0ea',
    borderSoft: '#edf1f6',
    primary: '#1677ff',
    primaryHover: '#4096ff',
    primaryActive: '#0958d9',
    danger: '#ff4d4f',
    dangerHover: '#ff7875',
    dangerActive: '#d9363e',
    disabled: '#bfbfbf',
    disabledBg: '#f5f5f5',
    shadowSm: '0 2px 8px rgba(15, 23, 42, 0.08)',
    shadowMd: '0 8px 24px rgba(15, 23, 42, 0.12)',
    headerBg: '#ffffff',
    codeBg: '#f6f8fa',
    codeText: '#1f2937',
    accentFrom: '#1f64ff',
    accentTo: '#13c2c2'
  },
  dark: {
    bgPage: '#0f172a',
    bgContainer: '#111827',
    bgElevated: '#1f2937',
    textPrimary: '#e5e7eb',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    border: '#334155',
    borderSoft: '#1e293b',
    primary: '#4096ff',
    primaryHover: '#69b1ff',
    primaryActive: '#1677ff',
    danger: '#ff7875',
    dangerHover: '#ff9c9c',
    dangerActive: '#ff4d4f',
    disabled: '#64748b',
    disabledBg: '#1e293b',
    shadowSm: '0 2px 10px rgba(2, 6, 23, 0.5)',
    shadowMd: '0 10px 28px rgba(2, 6, 23, 0.62)',
    headerBg: '#111827',
    codeBg: '#0b1220',
    codeText: '#dbeafe',
    accentFrom: '#3b82f6',
    accentTo: '#22d3ee'
  }
} as const;

const baseTheme = {
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24
  },
  typography: {
    headerTitleSize: 18,
    headerSubtitleSize: 13,
    welcomeTitleSize: 20,
    welcomeDescriptionSize: 14,
    headerWeightBold: 600,
    headerWeightMedium: 500
  },
  motion: {
    headerFadeInDuration: 600,
    headerCharDelay: 18,
    avatarPulseDuration: 500,
    avatarPulseScale: 1.08,
    welcomeHoverScale: 1.02,
    welcomeTransitionDuration: 300,
    easingEaseOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  },
  aiChat: {
    header: {
      mainLine: '智能洞察 · 秒级响应 · 持续学习的剧本创作助手',
      subLineEn: 'AI-powered story consultant for professional screenwriting.'
    },
    welcome: {
      primaryGradientFrom: '#597EF7',
      primaryGradientTo: '#85A5FF',
      buttonHeight: 48
    },
    avatar: {
      botGradientFrom: '#597EF7',
      botGradientTo: '#85A5FF',
      size: 32,
      iconSize: 24,
      userPalette: [
        ['#34d399', '#06b6d4'],
        ['#f97316', '#facc15'],
        ['#6366f1', '#a855f7'],
        ['#ec4899', '#f97316']
      ],
      userPaletteDark: [
        ['#4ade80', '#22d3ee'],
        ['#fb923c', '#fde047'],
        ['#818cf8', '#c084fc'],
        ['#f472b6', '#fb923c']
      ]
    }
  }
} as const;

export const getAppTheme = (mode: ResolvedThemeMode) => {
  const token = semanticTokens[mode];
  return {
    ...baseTheme,
    mode,
    color: {
      primary: token.primary,
      primaryHover: token.primaryHover,
      primaryActive: token.primaryActive,
      success: '#10b981',
      textPrimary: token.textPrimary,
      textSecondary: token.textSecondary,
      textSecondaryDark: semanticTokens.dark.textSecondary,
      textTertiary: token.textTertiary,
      backgroundLight: semanticTokens.light.bgContainer,
      backgroundDark: semanticTokens.dark.bgContainer,
      backgroundPage: token.bgPage,
      backgroundContainer: token.bgContainer,
      backgroundElevated: token.bgElevated,
      border: token.border,
      borderSoft: token.borderSoft,
      disabled: token.disabled,
      disabledBg: token.disabledBg,
      danger: token.danger,
      glassLightBackground: 'rgba(255, 255, 255, 0.95)',
      glassDarkBackground: 'rgba(31, 31, 31, 0.95)',
      glassLightShadowOuter: 'rgba(24, 144, 255, 0.12)',
      glassDarkShadowOuter: 'rgba(102, 126, 234, 0.18)'
    }
  } as const;
};

export type AppTheme = ReturnType<typeof getAppTheme>;
export const appTheme = getAppTheme('light');

export const getAntdThemeConfig = (mode: ResolvedThemeMode): ThemeConfig => {
  const token = semanticTokens[mode];
  return {
    algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: token.primary,
      colorBgBase: token.bgPage,
      colorBgContainer: token.bgContainer,
      colorBgElevated: token.bgElevated,
      colorText: token.textPrimary,
      colorTextSecondary: token.textSecondary,
      colorBorder: token.border,
      colorBorderSecondary: token.borderSoft,
      colorFillTertiary: token.disabledBg,
      colorTextDisabled: token.disabled,
      colorError: token.danger,
      borderRadius: baseTheme.radius.md,
      boxShadow: token.shadowSm
    }
  };
};

export const getThemeCssVariables = (mode: ResolvedThemeMode) => {
  const token = semanticTokens[mode];
  return {
    '--color-bg-page': token.bgPage,
    '--color-bg-container': token.bgContainer,
    '--color-bg-elevated': token.bgElevated,
    '--color-text-primary': token.textPrimary,
    '--color-text-secondary': token.textSecondary,
    '--color-text-tertiary': token.textTertiary,
    '--color-border': token.border,
    '--color-border-soft': token.borderSoft,
    '--color-primary': token.primary,
    '--color-primary-hover': token.primaryHover,
    '--color-primary-active': token.primaryActive,
    '--color-danger': token.danger,
    '--color-danger-hover': token.dangerHover,
    '--color-danger-active': token.dangerActive,
    '--color-disabled': token.disabled,
    '--color-disabled-bg': token.disabledBg,
    '--shadow-sm': token.shadowSm,
    '--shadow-md': token.shadowMd,
    '--color-header-bg': token.headerBg,
    '--color-code-bg': token.codeBg,
    '--color-code-text': token.codeText,
    '--project-accent-from': token.accentFrom,
    '--project-accent-to': token.accentTo
  };
};
