import { WC } from '../lib/jsx';
import { useTheme } from './providers';
import { Game, ThemeSwitchButton } from './components';
import { createMemo, useAsync } from '../lib/core';
import { SideMenu } from './components/side-menu/side-menu';
import { signalComponent } from '../lib/core/signal-core/signal-component/signal-component';
import { createSignal, derivedSignal } from '../lib/core/signal-core/create-signal';
import { Signal } from 'src.functional/lib/core/signal-core/models';
import { ExamplePage02 } from './example-page-02';
import './app.scss';

export function App() {
  return (
    <div>
      {/* <SideMenu /> */}
      <ExamplePage02 />
      {/* <Title />
      <ThemeSwitchButton /> 
      <Counter initialCount={0} />
      <Game /> */}
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


const Counter = signalComponent(
  function Counter(props: { initialCount: number }) {
    const [count, setCount] = createSignal(props.initialCount);
    const inc = () => setCount(count.value + 1);
    return <div>
      <Label label={count} />
      <div>
        <button onClick={inc}>click here : {count}</button>
      </div>
    </div>
  }
)


const Label = signalComponent(
  function Label(props: {label: Signal<number>}) {
    const derivedLabel = derivedSignal(props.label, (label) => `label ${label}`.toUpperCase());
    return <label>{derivedLabel}</label>;
  }
)