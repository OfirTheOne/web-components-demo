import { HookType } from '../../models/i-render-context';
import { RenderSignal } from '../render-signal/render-signal';

export function createSignal<T = any>(initValue: T) {
  RenderSignal.instance.currentContext.declareHook(HookType.createSignal);
  const hookPositionInContext = RenderSignal.instance.currentContext.hookCounter - 1;
  const currentContext = RenderSignal.instance.currentContext;
  const hookSlot = currentContext.getHookSlot(hookPositionInContext);
  if (!hookSlot.initialized) {
    hookSlot.value = initValue;
    hookSlot.initialized = true;
  }
  const getSignal = (): T => {
    return hookSlot.value;
  };
  const setSignal = (value: T) => {
    currentContext.stateChangesQueue.push(() => (hookSlot.value = value));
    currentContext.renderTaskAgent.registerTask();
  };
  return [getSignal, setSignal] as const;
}
