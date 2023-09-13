import { SignalSubscriptionDetails } from '../models';


export type RenderSignalValuePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export function renderSignalProperty(signalValue: unknown, signal: RenderSignalValuePayload) {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (signal.containerElement instanceof HTMLElement) {
        if (signalValue !== null && signalValue !== undefined) {
            signal.containerElement.setAttribute(signal.propKey, String(signalValue));
        } else {
            signal.containerElement.removeAttribute(signal.propKey);
        }
    }
}
