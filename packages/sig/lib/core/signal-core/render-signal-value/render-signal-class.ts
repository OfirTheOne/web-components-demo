import { DOMUtils } from '@/core/utils/dom-utils';
import { SignalSubscriptionDetails, RenderSignalValueHandler } from '../models';


export type RenderSignalValuePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export const renderSignalClass: RenderSignalValueHandler = (signalValue, _prevValue, signal) => {
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
