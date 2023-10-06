import { DOM } from '@sigjs/dom';
import { SignalSubscriptionDetails, RenderSignalValueHandler } from '../models';


export type RenderSignalValuePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export const renderSignalClassToggle: RenderSignalValueHandler = (signalValue, _prevValue, signal) => {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (DOM.validation.isElement(signal.containerElement)) {
        const shouldAdd = Boolean(signalValue);
        if(shouldAdd) {
            DOM.elementManipulation.addClass(signal.containerElement, signal.propKey);
        } else {
            DOM.elementManipulation.removeClass(signal.containerElement, signal.propKey);
        }
    }
}

export const renderSignalClassReplace: RenderSignalValueHandler = (signalValue, prevValue, signal) => {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (DOM.validation.isElement(signal.containerElement)) {
        const oldClassName = String(prevValue);
        const newClassName = String(signalValue);
        DOM.elementManipulation.replaceClass(signal.containerElement, oldClassName, newClassName);
    }
}
