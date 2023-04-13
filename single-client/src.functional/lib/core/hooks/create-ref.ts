import { HookType } from '../../models/i-render-context';
import { RenderSignal } from '../render-signal/render-signal';

export function createRef<T = any>(initValue: T = null) {
    RenderSignal.instance.currentContext.declareHook(HookType.createRef);
    const hookPositionInContext = RenderSignal.instance.currentContext.hookCounter - 1;
    const currentContext = RenderSignal.instance.currentContext;
    const hookSlot = currentContext.getHookSlot(hookPositionInContext);
    if (!hookSlot.initialized) {
        hookSlot.value = initValue;
        hookSlot.initialized = true;
    }
    const getRef = (): T => {
        return hookSlot.value;
    };
    const setRef = (value: T) => {
        hookSlot.value = value;
    };
    return [getRef, setRef] as const;
}
