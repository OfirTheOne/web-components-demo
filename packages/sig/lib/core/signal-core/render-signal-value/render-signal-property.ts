import { SignalSubscriptionDetails } from '../models';


export type RenderSignalValuePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export function renderSignalProperty(signalValue: unknown, signal: RenderSignalValuePayload) {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (signalValue !== null && signalValue !== undefined) {
        if (signal.containerElement instanceof HTMLElement) {
            signal.containerElement.setAttribute(signal.propKey, String(signalValue));
        }
    }
}
