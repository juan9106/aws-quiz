import { useContext } from "react";
import { Theme, ThemeContext } from "../context/ThemeContext";

export const useTheme = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = (selectedTheme: Theme = theme === 'light' ? 'dark' : 'light') => {
        setTheme(selectedTheme);
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('theme-mode', selectedTheme);
    };

    return {
        toggleTheme: toggleTheme,
        theme: theme,
    }
}
