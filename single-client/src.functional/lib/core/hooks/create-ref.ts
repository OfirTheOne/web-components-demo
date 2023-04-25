import { HookType } from '../../models/i-render-context';
import { RenderContextCommunicator } from '../render-context/render-context-communicator';

export function createRef<T = any>(initValue: T = null) {
  RenderContextCommunicator.instance.currentContext.declareHook(HookType.createRef);
  const hookPositionInContext = RenderContextCommunicator.instance.currentContext.hookCounter - 1;
  const currentContext = RenderContextCommunicator.instance.currentContext;
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
