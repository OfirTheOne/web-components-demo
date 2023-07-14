

import { createCallback } from '../../../lib/core';
import { useTheme } from '../../providers/theme/theme-context';

export function ThemeSwitchButton() {
    const { theme, setTheme } = useTheme();
    const switchTheme = createCallback(() => {
        theme == 'light' ? setTheme('dark') : setTheme('light');
    }, [theme]);
    return (
        <button onClick={switchTheme}>    
            Switch Theme 
        </button>
    )
}