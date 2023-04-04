import { RenderSignal } from "../render-signal/render-signal";

export function createSignal<T = any>(initValue: T) {
    const currentContext = RenderSignal.instance.currentContext;
    if(!currentContext.projectedState.initialized) {
        currentContext.projectedState.value = initValue;
        currentContext.projectedState.initialized = true; 
    }
    const getSignal = (): T => {
        return currentContext.projectedState.value;
    };
    const setSignal = (value: T) => {
        currentContext.stateChangesQueue.push(() => currentContext.projectedState.value = value);
    };
    return [getSignal, setSignal] as const;
}