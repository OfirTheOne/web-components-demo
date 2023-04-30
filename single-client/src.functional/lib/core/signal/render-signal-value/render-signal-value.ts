import { SignalSubscription } from '../models';

export function renderSignalValue(signalValue: unknown, signal: SignalSubscription) {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (signalValue !== null && signalValue !== undefined) {
        if (signal.containerElement instanceof Text) {
            signal.containerElement.textContent = signalValue.toString();
        } else if (typeof signalValue === 'string') {
            signal.containerElement.innerHTML = signalValue;
        } else if (signalValue instanceof HTMLElement) {
            signal.containerElement.innerHTML = '';
            signal.containerElement.appendChild(signalValue);
        } else {
            signal.containerElement.innerHTML = signalValue.toString();
        }
    } else {
        if (signal.containerElement instanceof Text) {
            signal.containerElement.textContent = '';
        } else {
            signal.containerElement.innerHTML = '';
        }
    }
}
