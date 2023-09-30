import { DOMUtils } from '@/core/utils/dom-utils';
import { SignalSubscriptionDetails, RenderSignalValueHandler } from '../models';


export type RenderSignalValuePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export const renderSignalClassToggle: RenderSignalValueHandler = (signalValue, _prevValue, signal) => {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (DOMUtils.isElement(signal.containerElement)) {
        const shouldAdd = Boolean(signalValue);
        if(shouldAdd) {
            DOMUtils.addClass(signal.containerElement, signal.propKey);
        } else {
            DOMUtils.removeClass(signal.containerElement, signal.propKey);
        }
    }
}

export const renderSignalClassReplace: RenderSignalValueHandler = (signalValue, prevValue, signal) => {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (DOMUtils.isElement(signal.containerElement)) {
        const oldClassName = String(prevValue);
        const newClassName = String(signalValue);
        DOMUtils.replaceClass(signal.containerElement, oldClassName, newClassName);
    }
}
