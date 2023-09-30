import { SignalSubscriptionDetails, RenderSignalValueHandler } from '../models';
import { DOMUtils } from "@/core/utils/dom-utils";

export type RenderSignalValuePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export const renderSignalProperty: RenderSignalValueHandler = (signalValue: unknown, _prevValue, signal) => {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (DOMUtils.isElement(signal.containerElement)) {
        if(DOMUtils.isBooleanAttribute(signal.propKey)) {
            if (signalValue !== false &&
                signalValue !== null && signalValue !== undefined) {
                DOMUtils.setAttribute(signal.containerElement, signal.propKey, '');
            } else {
                DOMUtils.removeAttribute(signal.containerElement, signal.propKey);
            }
            return;
        }
        if (signalValue !== null && 
            signalValue !== undefined
        ) {
            DOMUtils.setAttribute(signal.containerElement, signal.propKey, String(signalValue));
        } else {
            DOMUtils.removeAttribute(signal.containerElement, signal.propKey);
        }
    }
}
