
import React from 'react'
import { useTheme } from '../hooks/useTheme'

export const ThemeToggle: React.FC = () => {
    const { toggleTheme, theme } = useTheme();

    const toggleSwtichMode = () => {
        toggleTheme();
    }

    return (
        <div className="toggle-switch">
            <input type="checkbox" checked={theme === 'dark'} className="checkbox" name="theme-mode" id="theme-mode" onChange={() => toggleSwtichMode()} />
            <label className="label" htmlFor="theme-mode">
            <span className="inner" />
            <span className="switch" />
            </label>
        </div>
    )
}
