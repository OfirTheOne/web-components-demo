
import { HookType } from "../../models/i-render-context";
import { RenderSignal } from "../render-signal/render-signal";

export function createRef<T = any>(initValue: T = null) {
    RenderSignal.instance.currentContext.declareHook(HookType.createRef);
    const hookPositionInContext = RenderSignal.instance.currentContext.hookCounter-1;
    const currentContext = RenderSignal.instance.currentContext;
    const projectedState = currentContext.projectState(hookPositionInContext);
    if(!projectedState.initialized) {
        projectedState.value = initValue;
        projectedState.initialized = true; 
    }
    const getRef = (): T => {
        return projectedState.value;
    };
    const setRef = (value: T) => {
        projectedState.value = value;
    };
    return [getRef, setRef] as const;
}