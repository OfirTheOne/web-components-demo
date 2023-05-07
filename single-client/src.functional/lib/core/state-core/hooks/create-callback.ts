import { HookType, MemoHookSlot } from '../../../models/i-render-context';
import { RenderContextCommunicator } from '../render-context/render-context-communicator';
import { isArrayShallowEqual } from '../../utils/common-utils';

export function createCallback<F extends (...args: unknown[]) => unknown>(callback: F, dependencies: any[]) {
  RenderContextCommunicator.instance.currentContext.declareHook(HookType.createCallback);
  const hookPositionInContext = RenderContextCommunicator.instance.currentContext.hookCounter - 1;
  const currentContext = RenderContextCommunicator.instance.currentContext;
  const hookSlot = currentContext.getHookSlot<MemoHookSlot>(hookPositionInContext);
  const isFirstRender = !hookSlot.initialized;
  if (isFirstRender || isDependenciesChanged(hookSlot.dependencies, dependencies)) {
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
