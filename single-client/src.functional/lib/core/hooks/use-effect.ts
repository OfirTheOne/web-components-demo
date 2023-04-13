import { HookType, EffectHookSlot } from '../../models/i-render-context';
import { RenderSignal } from '../render-signal/render-signal';
import { isArrayShallowEqual } from '../utils/common-utils';

export function useEffect(callback: () => void, dependencies: any[]) {
  RenderSignal.instance.currentContext.declareHook(HookType.useEffect);
  const hookPositionInContext = RenderSignal.instance.currentContext.hookCounter - 1;
  const currentContext = RenderSignal.instance.currentContext;
  const hookSlot = currentContext.getHookSlot<EffectHookSlot>(hookPositionInContext);
  const isFirstRender = !hookSlot.initialized;
  if (isFirstRender || isDependenciesChanged(hookSlot.dependencies, dependencies)) {
    if (isFirstRender) {
      hookSlot.initialized = true;
    }
    hookSlot.value = callback;
    hookSlot.dependencies = dependencies;
    currentContext.effectQueue.push(() => {
      const maybeOnUnmount = hookSlot.value();
      if (maybeOnUnmount && typeof maybeOnUnmount === 'function') {
        hookSlot.onUnmount = maybeOnUnmount;
      }
    });
  }
}

function isDependenciesChanged(oldDependencies: any[], newDependencies: any[]) {
  return !isArrayShallowEqual(oldDependencies, newDependencies);
}
