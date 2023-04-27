import { Signal } from "../render-context/signal-render-context";


export function renderSignalValue (signal: Signal) {

    if( signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (signal.value !== null && signal.value !== undefined) {
        if (typeof signal.value === 'string') {
            signal.containerElement.innerHTML = signal.value;
        } else if (signal.value instanceof HTMLElement) {
            signal.containerElement.innerHTML = '';
            signal.containerElement.appendChild(signal.value);
        } else {
            signal.containerElement.innerHTML = signal.value.toString();
        }
    } else {
        signal.containerElement.innerHTML = '';
    }
}
