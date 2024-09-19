import React from 'react'
import { ThemeToggle } from './ThemeToggle';

import './TopBar.css';

export const TopBar: React.FC = () => {

    return (
        <div className="topbar-container">
            <ThemeToggle />
        </div>
    )
}
