import { WC } from '../lib/jsx';
import { useTheme } from './providers';
import { Game, ThemeSwitchButton } from './components';
import { createMemo, useAsync } from '../lib/core';
import { SideMenu } from './components/side-menu/side-menu';

export function App() {
  return (
    <div>
      <SideMenu />
      <Title />
      <ThemeSwitchButton /> 
      <Game />
    </div>
  );
}


export function Title() {
  const themeCtx = useTheme();
  const titleAsync = createMemo(async () => { await wait(3000); return 'TicTacToe Example';}, [])
  const [title] = useAsync(titleAsync)
  return <h1>{title || 'loading ... ' } {themeCtx.theme}</h1>;
}


const wait = (ms: number) => new Promise((res) => setTimeout(() => res(undefined), ms));