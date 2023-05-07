import { HookType, EffectHookSlot } from '../../../models/i-render-context';
import { RenderContextCommunicator } from '../render-context/render-context-communicator';
import { isArrayShallowEqual } from '../../utils/common-utils';

export function useEffect(callback: () => void, dependencies: any[]) {
  RenderContextCommunicator.instance.currentContext.declareHook(HookType.useEffect);
  const hookPositionInContext = RenderContextCommunicator.instance.currentContext.hookCounter - 1;
  const currentContext = RenderContextCommunicator.instance.currentContext;
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
