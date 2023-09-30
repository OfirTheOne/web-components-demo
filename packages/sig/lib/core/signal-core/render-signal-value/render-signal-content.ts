import { SignalSubscriptionDetails, RenderSignalValueHandler } from '../models';

export type RenderSignalContentPayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected'>;

export const renderSignalContent: RenderSignalValueHandler = (signalValue, _prevValue, sub): void => {
    if (sub.containerElement === null || sub.containerElement === undefined || !sub.connected) {
        return;
    }
    if (signalValue !== null && signalValue !== undefined) {
        if (sub.containerElement instanceof Text) {
            sub.containerElement.textContent = String(signalValue);
        } else if (typeof signalValue === 'string') {
            sub.containerElement.innerHTML = signalValue;
        } else if (signalValue instanceof HTMLElement) {
            sub.containerElement.innerHTML = '';
            sub.containerElement.appendChild(signalValue);
        } else {
            sub.containerElement.innerHTML = String(signalValue);
        }
    } else {
        if (sub.containerElement instanceof Text) {
            sub.containerElement.textContent = '';
        } else {
            sub.containerElement.innerHTML = '';
        }
    }
}
