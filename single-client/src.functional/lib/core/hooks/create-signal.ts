import { RenderSignal } from "../render-signal/render-signal";

export function createSignal<T = any>(initValue: T) {

    if(!RenderSignal.currentContext.projectedState.initialized) {
        RenderSignal.currentContext.projectedState.value = initValue;
        RenderSignal.currentContext.projectedState.initialized = true; 
    }
    const getSignal = (): T => {
        return RenderSignal.currentContext.projectedState.value;
    }
    const setSignal = (value: T) => {
        RenderSignal.currentContext.projectedState.value = value;
    }
    return [getSignal, setSignal] as const;

}