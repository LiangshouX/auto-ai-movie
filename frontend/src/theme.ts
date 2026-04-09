import type {ThemeConfig} from 'antd';
import {theme as antdTheme} from 'antd';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

const semanticTokens = {
  light: {
    bgPage: '#f4f4f5',
    bgContainer: '#ffffff',
    bgElevated: '#ffffff',
    textPrimary: '#18181b',
    textSecondary: '#52525b',
    textTertiary: '#a1a1aa',
    border: '#e4e4e7',
    borderSoft: '#f4f4f5',
    primary: '#4f46e5',
    primaryHover: '#6366f1',
    primaryActive: '#4338ca',
    danger: '#e11d48',
    dangerHover: '#f43f5e',
    dangerActive: '#be123c',
    disabled: '#d4d4d8',
    disabledBg: '#f4f4f5',
    shadowSm: '0 4px 12px rgba(0, 0, 0, 0.05)',
    shadowMd: '0 10px 30px rgba(0, 0, 0, 0.08)',
    headerBg: 'rgba(255, 255, 255, 0.85)',
    codeBg: '#f4f4f5',
    codeText: '#18181b',
    accentFrom: '#4f46e5',
    accentTo: '#06b6d4'
  },
  dark: {
    bgPage: '#09090b',
    bgContainer: '#18181b',
    bgElevated: '#27272a',
    textPrimary: '#fafafa',
    textSecondary: '#a1a1aa',
    textTertiary: '#52525b',
    border: '#27272a',
    borderSoft: '#18181b',
    primary: '#6366f1',
    primaryHover: '#818cf8',
    primaryActive: '#4f46e5',
    danger: '#f43f5e',
    dangerHover: '#fb7185',
    dangerActive: '#e11d48',
    disabled: '#52525b',
    disabledBg: '#18181b',
    shadowSm: '0 4px 15px rgba(0, 0, 0, 0.5)',
    shadowMd: '0 15px 40px rgba(0, 0, 0, 0.7)',
    headerBg: 'rgba(9, 9, 11, 0.75)',
    codeBg: '#18181b',
    codeText: '#e0e7ff',
    accentFrom: '#818cf8',
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
