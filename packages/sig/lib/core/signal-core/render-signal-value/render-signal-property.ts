import { DOM } from '@sigjs/dom';
import { SignalSubscriptionDetails, RenderSignalValueHandler } from '../models';

export type RenderSignalValuePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export const renderSignalProperty: RenderSignalValueHandler = (signalValue: unknown, _prevValue, signal) => {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (DOM.validation.isElement(signal.containerElement)) {
        if(DOM.validation.isBooleanAttribute(signal.propKey)) {
            if (signalValue !== false &&
                signalValue !== null && signalValue !== undefined) {
                DOM.elementManipulation.setAttribute(signal.containerElement, signal.propKey, '');
            } else {
                DOM.elementManipulation.removeAttribute(signal.containerElement, signal.propKey);
            }
            return;
        }
        if (signalValue !== null && 
            signalValue !== undefined
        ) {
            DOM.elementManipulation.setAttribute(signal.containerElement, signal.propKey, String(signalValue));
        } else {
            DOM.elementManipulation.removeAttribute(signal.containerElement, signal.propKey);
        }
    }
}
