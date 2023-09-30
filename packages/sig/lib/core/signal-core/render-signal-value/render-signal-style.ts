import { SignalSubscriptionDetails, RenderSignalValueHandler } from '../models';

export type RenderSignalStylePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export const renderSignalStyle: RenderSignalValueHandler = (signalValue, _prevValue, signal) => {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (signal.containerElement instanceof HTMLElement) {
        if (signalValue !== null && signalValue !== undefined && signalValue !== '' ) {
            signal.containerElement.style[signal.propKey] = String(signalValue);
        } else {
            signal.containerElement.style.removeProperty(signal.propKey);
        }
    }
}
