import { WC } from '../lib/jsx';
import { ThemeProvider, useTheme } from './theme-context';
import { Game } from './game';
import { ThemeSwitchButton } from './theme-switch';

export function App() {
  return (
    <div>
      <ThemeProvider>
        <Title />
          <ThemeSwitchButton />
        <Game />
      </ThemeProvider>
    </div>
  );
}

export function Title() {
  const themeCtx = useTheme();
  return <h1>TicTacToe Example {themeCtx.theme}</h1>;
}
