import { createContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark';

interface ThemeContext {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const themeContext: ThemeContext = {
    theme: 'light',
    setTheme: () => {},
};

export const ThemeContext = createContext<ThemeContext>(themeContext);


export const ThemeContextProvider = ({ children }: { children: React.ReactNode })  => {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme-mode') as Theme;
        const themeMode = savedTheme || theme;
        setTheme(themeMode);
        document.documentElement.setAttribute('data-theme', themeMode);
        if (!savedTheme) localStorage.setItem('theme-mode', themeMode);
    }, [theme])

    if(!theme) return <div></div>

    return (
        <ThemeContext.Provider value={{ theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}