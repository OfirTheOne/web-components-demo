import { HookType } from '../../../models/i-render-context';
import { RenderContextCommunicator } from '../render-context/render-context-communicator';

export function createState<T = any>(initValue: T) {
  RenderContextCommunicator.instance.currentContext.declareHook(HookType.createState);
  const hookPositionInContext = RenderContextCommunicator.instance.currentContext.hookCounter - 1;
  const currentContext = RenderContextCommunicator.instance.currentContext;
  const hookSlot = currentContext.getHookSlot(hookPositionInContext);
  if (!hookSlot.initialized) {
    hookSlot.value = initValue;
    hookSlot.initialized = true;
  }
  const select = (): T => {
    return hookSlot.value;
  };
  const setSignal = (value: T) => {
    currentContext.stateChangesQueue.push(() => (hookSlot.value = value));
    currentContext.renderTaskAgent.registerTask();
  };
  return [select, setSignal] as const;
}
