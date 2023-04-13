import { HookType, MemoHookSlot } from '../../models/i-render-context';
import { RenderSignal } from '../render-signal/render-signal';
import { isArrayShallowEqual } from '../utils/common-utils';

export function createCallback<F extends (...args: unknown[]) => unknown>(
    callback: F,
    dependencies: any[]
) {
    RenderSignal.instance.currentContext.declareHook(HookType.createCallback);
    const hookPositionInContext =
        RenderSignal.instance.currentContext.hookCounter - 1;
    const currentContext = RenderSignal.instance.currentContext;
    const hookSlot = currentContext.getHookSlot<MemoHookSlot>(
        hookPositionInContext
    );
    const isFirstRender = !hookSlot.initialized;
    if (
        isFirstRender ||
        isDependenciesChanged(hookSlot.dependencies, dependencies)
    ) {
        if (isFirstRender) {
            hookSlot.initialized = true;
        }
        hookSlot.value = callback;
        hookSlot.dependencies = dependencies;
    }
    return hookSlot.value;
}

function isDependenciesChanged(oldDependencies: any[], newDependencies: any[]) {
    return !isArrayShallowEqual(oldDependencies, newDependencies);
}
