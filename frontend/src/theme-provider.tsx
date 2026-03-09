import React from 'react';
import {ConfigProvider} from 'antd';
import {ThemeProvider} from '@emotion/react';
import {getAntdThemeConfig, getAppTheme, getThemeCssVariables, ResolvedThemeMode, ThemeMode} from './theme';

const STORAGE_KEY = 'auto-ai-movie.theme-mode';
const DARK_QUERY = '(prefers-color-scheme: dark)';

interface ThemeContextValue {
    themeMode: ThemeMode;
    resolvedThemeMode: ResolvedThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = React.createContext<ThemeContextValue>({
    themeMode: 'system',
    resolvedThemeMode: 'light',
    setThemeMode: () => undefined
});

const getSystemThemeMode = (): ResolvedThemeMode => {
    if (typeof window === 'undefined') {
        return 'light';
    }
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
};

const getStoredThemeMode = (): ThemeMode => {
    if (typeof window === 'undefined') {
        return 'system';
    }
    const mode = window.localStorage.getItem(STORAGE_KEY);
    return mode === 'light' || mode === 'dark' || mode === 'system' ? mode : 'system';
};

const resolveThemeMode = (mode: ThemeMode): ResolvedThemeMode => {
    return mode === 'system' ? getSystemThemeMode() : mode;
};

export const bootstrapThemeMode = () => {
    if (typeof document === 'undefined') {
        return;
    }
    const mode = getStoredThemeMode();
    const resolved = resolveThemeMode(mode);
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
    const variables = getThemeCssVariables(resolved);
    Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
};

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [themeMode, setThemeMode] = React.useState<ThemeMode>(() => getStoredThemeMode());
    const [systemThemeMode, setSystemThemeMode] = React.useState<ResolvedThemeMode>(() => getSystemThemeMode());
    const resolvedThemeMode = React.useMemo(
        () => (themeMode === 'system' ? systemThemeMode : themeMode),
        [systemThemeMode, themeMode]
    );

    React.useEffect(() => {
        const media = window.matchMedia(DARK_QUERY);
        const onChange = (event: MediaQueryListEvent) => {
            setSystemThemeMode(event.matches ? 'dark' : 'light');
        };
        setSystemThemeMode(media.matches ? 'dark' : 'light');
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    React.useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, themeMode);
    }, [themeMode]);

    React.useEffect(() => {
        const root = document.documentElement;
        root.dataset.theme = resolvedThemeMode;
        root.style.colorScheme = resolvedThemeMode;
        const variables = getThemeCssVariables(resolvedThemeMode);
        Object.entries(variables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [resolvedThemeMode]);

    const value = React.useMemo(
        () => ({
            themeMode,
            resolvedThemeMode,
            setThemeMode
        }),
        [resolvedThemeMode, themeMode]
    );

    const emotionTheme = React.useMemo(() => getAppTheme(resolvedThemeMode), [resolvedThemeMode]);
    const antdTheme = React.useMemo(() => getAntdThemeConfig(resolvedThemeMode), [resolvedThemeMode]);

    return (
        <ThemeModeContext.Provider value={value}>
            <ConfigProvider theme={antdTheme}>
                <ThemeProvider theme={emotionTheme}>
                    {children}
                </ThemeProvider>
            </ConfigProvider>
        </ThemeModeContext.Provider>
    );
};

export const useAppThemeMode = () => React.useContext(ThemeModeContext);
