import { WC } from '../lib/jsx';
import { useTheme } from './providers';
import { Game, ThemeSwitchButton } from './components';
import { createMemo, useAsync } from '../lib/core';
import { SideMenu } from './components/side-menu/side-menu';
import { signal } from '../lib/core/signal/signal-component/signal-component';
import { createSignal } from '../lib/core/signal/create-signal/create-signal';
import { Signal } from 'src.functional/lib/core/signal/models';

export function App() {
  return (
    <div>
      <SideMenu />
      <Title />
      <ThemeSwitchButton /> 
      <Counter initialCount={0} />
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


const Counter = signal(
  function Counter(props: { initialCount: number }) {
    const [count, setCount] = createSignal(props.initialCount);
    const inc = () => setCount(count.value + 1);
    return <>
    <button onClick={inc}>{count}</button>
      <Label label={count} />
    </>
  }
)


const Label = signal(
  function Label(props: {label: Signal<number>}) {
    return <label>{props.label}</label>;
  }
)