import { HookType } from "../../models/i-render-context";
import { RenderSignal } from "../render-signal/render-signal";

export function createSignal<T = any>(initValue: T) {
    RenderSignal.instance.currentContext.declareHook(HookType.createSignal);
    const hookPositionInContext = RenderSignal.instance.currentContext.hookCounter-1;
    const currentContext = RenderSignal.instance.currentContext;
    const projectedState = currentContext.projectState(hookPositionInContext);
    if(!projectedState.initialized) {
        projectedState.value = initValue;
        projectedState.initialized = true; 
    }
    const getSignal = (): T => {
        return projectedState.value;
    };
    const setSignal = (value: T) => {
        currentContext.stateChangesQueue.push(() => projectedState.value = value);
        currentContext.renderTaskAgent.registerRender();
    };
    return [getSignal, setSignal] as const;
}