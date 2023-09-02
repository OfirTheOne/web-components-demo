import { SignalSubscriptionDetails } from '../models';


export type RenderSignalContentPayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected'>;

export function renderSignalContent(signalValue: unknown, signal: RenderSignalContentPayload) {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (signalValue !== null && signalValue !== undefined) {
        if (signal.containerElement instanceof Text) {
            signal.containerElement.textContent = String(signalValue);
        } else if (typeof signalValue === 'string') {
            signal.containerElement.innerHTML = signalValue;
        } else if (signalValue instanceof HTMLElement) {
            signal.containerElement.innerHTML = '';
            signal.containerElement.appendChild(signalValue);
        } else {
            signal.containerElement.innerHTML = String(signalValue);
        }
    } else {
        if (signal.containerElement instanceof Text) {
            signal.containerElement.textContent = '';
        } else {
            signal.containerElement.innerHTML = '';
        }
    }
}
