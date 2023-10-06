

# API

# `sig`

<br>

## render

main render function, rendering Sig application mounting a root element. 
once the window was loaded the application will start rendering, if the window already loaded the rendering will start immediately.

```tsx
import { render } from 'sig';
import { RootApp } from './root-app';

render(<RootApp />, 'root');
```

</br>

<hr>

</br>

## Standard JSX

</br>

## Extended JSX - class:list

`class:list` is a sig flavor JSX's attribute, with that type :

```ts
type ClassList = Array<Trackable<unknown> | string | string[] | Record<string, boolean | Trackable<unknown>>>
```

allowing the binding of a trackable primitive (eg signal) to a specific class or set of classes.

for example :

```tsx
export const Toggle: FC<{ $value: Signal<boolean> }> = ({ $value: $isOn }) => {
    const $bgColor = derivedSignal($isOn, (isOn) => isOn ? "bg-green-400" : "bg-gray-300");
    const onToggle = () => $isOn.setValue((prev) => !prev);
    return (
        <div
            class:list={[`relative inline-block w-10 h-6 rounded-full`, $bgColor]}
            onClick={onToggle}
        >
        ...
        </div>
    );
}
```

</br>

## Binding JSX Signal 

a signal (or any of the trackable primitives) can be bind "seamlessly" to a property of a JSX element or a JSX children.  

for example : 

```tsx
export const Input: FC<
    { value: Sig.Signal<string> } &
    Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value'>
> = ({ value, list = null, ...props }) => {
    return (
        <input
            value={value}
            onInput={(e) => value.setValue(() => e.target.value)}
            {...props} />
    );
}
```

</br>

<hr>

</br>

## Lifecycle

### onMount

A lifecycle hook, called once the component mounted the dom.
```tsx
import { derivedSignal, signal, onMount } from "sig";

function Game() {
    const $gameState = signal(initialState);
    const $snakeDots = derivedSignal($gameState, (state) => state.snakeDots);
    const $food = derivedSignal($gameState, (state) => state.food);
    let timer: NodeJS.Timer | null = null;

    onMount(() => {
        // will called once, when the component mounted. 
        timer = setInterval(moveSnake, $gameState.value.speed);
        document.onkeydown = onKeyDown;
    });
    
    ...

    return (
        <div> ... 
        </div>
    );
}
    
```


### onUnmount

A lifecycle hook, called once the component unmount the dom.

```tsx
import { derivedSignal, signal, onMount } from "sig";

function Game() {
    const $gameState = signal(initialState);
    const $snakeDots = derivedSignal($gameState, (state) => state.snakeDots);
    const $food = derivedSignal($gameState, (state) => state.food);
    let timer: NodeJS.Timer | null = null;

    ...

    onUnmount(() => {
        clearInterval(timer);
        document.onkeydown = null;
    });
    
    ...

    return (
        <div> ... 
        </div>
    );
}
    
```


### onDispose

A lifecycle hook, called once the component disposed from it's container.

</br>

<hr>

</br>

## Signal Primitive

### signal 

### decoratedSignal

### derivedSignal 

### resourceSignal 

</br>

<hr>

</br>

## Control Flow

### Show

### Switch

### Case

### Slot

### For

### Route

### Link

</br>

<hr>

</br>


# `@sig/store`

<br>

## Store

### createStore

### createSignalStore

</br>

<hr>

</br>

# `@sig/router`

<br>

## Router

### HistoryAdapter

</br>

<hr>

</br>

# `@sig/forms`

<br>

## Form

</br>

<hr>

</br>

# `@sig/common`

<br>

## Common

</br>

<hr>

</br>