import { WC } from '../lib/jsx';
import { ThemeProvider, useTheme } from './providers';
import { Game, ThemeSwitchButton } from './components';

export function App() {
  return (
    <div>
      <Title />
      <ThemeSwitchButton /> 
      <Game />
    </div>
  );
}


export function RootApp() {
  return (
      <ThemeProvider>
        <App/>
      </ThemeProvider>
  );
}

export function Title() {
  const themeCtx = useTheme();
  return <h1>TicTacToe Example {themeCtx.theme}</h1>;
}
