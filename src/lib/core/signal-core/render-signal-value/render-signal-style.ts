import { SignalSubscriptionDetails } from '../models';


export type RenderSignalStylePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export function renderSignalStyle(signalValue: unknown, signal: RenderSignalStylePayload) {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (signalValue !== null && signalValue !== undefined) {
        if (signal.containerElement instanceof HTMLElement) {
            signal.containerElement.style[signal.propKey] = String(signalValue);
        }
    }
}
