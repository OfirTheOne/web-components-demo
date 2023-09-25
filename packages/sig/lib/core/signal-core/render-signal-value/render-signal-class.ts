import { DOMUtils } from '@/core/utils/dom-utils';
import { SignalSubscriptionDetails } from '../models';


export type RenderSignalValuePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export function renderSignalClass(signalValue: unknown, signal: RenderSignalValuePayload) {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (signal.containerElement instanceof HTMLElement) {
        const shouldAdd = Boolean(signalValue);
        if(shouldAdd) {
            DOMUtils.addClass(signal.containerElement, signal.propKey);
        } else {
            DOMUtils.removeClass(signal.containerElement, signal.propKey);
        }
    }
}
