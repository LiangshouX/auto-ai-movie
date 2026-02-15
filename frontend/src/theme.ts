export const appTheme = {
  color: {
    primary: '#1677ff',
    success: '#10b981',
    textPrimary: '#1d1d1d',
    textSecondary: '#4e5969',
    textSecondaryDark: '#d1d5db',
    backgroundLight: '#ffffff',
    backgroundDark: '#1f1f1f',
    glassLightBackground: 'rgba(255, 255, 255, 0.95)',
    glassDarkBackground: 'rgba(31, 31, 31, 0.95)',
    glassLightShadowOuter: 'rgba(24, 144, 255, 0.12)',
    glassDarkShadowOuter: 'rgba(102, 126, 234, 0.18)',
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  typography: {
    headerTitleSize: 18,
    headerSubtitleSize: 13,
    welcomeTitleSize: 20,
    welcomeDescriptionSize: 14,
    headerWeightBold: 600,
    headerWeightMedium: 500,
  },
  motion: {
    headerFadeInDuration: 600,
    headerCharDelay: 18,
    avatarPulseDuration: 500,
    avatarPulseScale: 1.08,
    welcomeHoverScale: 1.02,
    welcomeTransitionDuration: 300,
    easingEaseOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  },
  aiChat: {
    header: {
      mainLine: '智能洞察 · 秒级响应 · 持续学习的剧本创作助手',
      subLineEn: 'AI-powered story consultant for professional screenwriting.',
    },
    welcome: {
      primaryGradientFrom: '#597EF7',
      primaryGradientTo: '#85A5FF',
      buttonHeight: 48,
    },
    avatar: {
      botGradientFrom: '#597EF7',
      botGradientTo: '#85A5FF',
      size: 64,
      iconSize: 24,
      userPalette: [
        ['#34d399', '#06b6d4'],
        ['#f97316', '#facc15'],
        ['#6366f1', '#a855f7'],
        ['#ec4899', '#f97316'],
      ],
      userPaletteDark: [
        ['#4ade80', '#22d3ee'],
        ['#fb923c', '#fde047'],
        ['#818cf8', '#c084fc'],
        ['#f472b6', '#fb923c'],
      ],
    },
  },
} as const;

export type AppTheme = typeof appTheme;
