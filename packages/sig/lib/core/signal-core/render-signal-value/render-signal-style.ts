import { StylePropsUtils } from '@/core/utils';
import { SignalSubscriptionDetails, RenderSignalValueHandler } from '../models';



export type RenderSignalStylePayload = Pick<SignalSubscriptionDetails, 'containerElement' | 'connected' | 'propKey'>;

export const renderSignalStyleProp: RenderSignalValueHandler = (signalValue, _prevValue, signal) => {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (signal.containerElement instanceof HTMLElement) {
        const nativeStyleProp = StylePropsUtils.convertStylePropNameToNativeStylePropName(signal.propKey)
        if (signalValue !== null && signalValue !== undefined && signalValue !== '' ) {
            signal.containerElement.style.setProperty(nativeStyleProp, String(signalValue));
        } else {
            signal.containerElement.style.removeProperty(nativeStyleProp);
        }
    }
}

export const renderSignalStyle: RenderSignalValueHandler = (signalValue, _prevValue, signal) => {
    if (signal.containerElement === null || signal.containerElement === undefined || !signal.connected) {
        return;
    }
    if (signal.containerElement instanceof HTMLElement) {
        if (signalValue !== null && signalValue !== undefined && typeof signalValue === 'object' ) {
        const nativeStylePropObject = StylePropsUtils.convertStylePropObjectToNativeStylePropObject(signalValue as Record<string, unknown>)

            for(const styleProp in signal.containerElement.style) {
                if (!(styleProp in nativeStylePropObject)) {
                    signal.containerElement.style.removeProperty(styleProp);
                } else {
                    signal.containerElement.style.setProperty(styleProp, nativeStylePropObject[styleProp] as string);
                }
            }            
            for(const styleProp in nativeStylePropObject) {
                signal.containerElement.style.setProperty(styleProp, nativeStylePropObject[styleProp] as string);
            }
        } else if(!signalValue){
            signal.containerElement.removeAttribute("style");
        }
    }
}

