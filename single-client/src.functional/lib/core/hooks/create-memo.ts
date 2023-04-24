import { HookType, MemoHookSlot } from '../../models/i-render-context';
import { RenderSignal } from '../render-signal/render-signal';
import { isArrayShallowEqual } from '../utils/common-utils';


export function createMemo<F extends (...args: any[]) => any>(factory: F, dependencies: any[]): ReturnType<F> {
  RenderSignal.instance.currentContext.declareHook(HookType.createMemo);
  const hookPositionInContext = RenderSignal.instance.currentContext.hookCounter - 1;
  const currentContext = RenderSignal.instance.currentContext;
  const hookSlot = currentContext.getHookSlot<MemoHookSlot>(hookPositionInContext);
  const isFirstRender = !hookSlot.initialized;
  if (isFirstRender || isDependenciesChanged(hookSlot.dependencies, dependencies)) {
    if (isFirstRender) {
      hookSlot.initialized = true;
    }
    hookSlot.value = factory();
    hookSlot.dependencies = dependencies;
  }
  return hookSlot.value;
}

function isDependenciesChanged(oldDependencies: unknown[], newDependencies: unknown[]) {
  return !isArrayShallowEqual(oldDependencies, newDependencies);
}
