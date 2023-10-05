
# API

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

<br>

## Lifecycle

### onMount

### onUnmount

### onDispose

<br>

## Signal Primitive

### signal 

### decoratedSignal

### derivedSignal 

### resourceSignal 

<br>

## Control Flow

### Show

### Switch

### Case

### Slot

### For

### Route

### Link

<br>

## Store

### createStore

### createSignalStore

<br>

## Router

### HistoryAdapter

