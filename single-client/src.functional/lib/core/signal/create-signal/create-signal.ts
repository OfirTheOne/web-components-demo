import { Signal } from '../render-context/signal-render-context';
import { SignalRenderContextCommunicator } from '../render-context/signal-render-context-communicator';
import { renderSignalValue } from '../render-signal-value/render-signal-value';

export function createSignal<T = any>(initValue: T) {
  const currentContext = SignalRenderContextCommunicator.instance.currentContext;
  if(!currentContext) {
    throw new Error('createSignal must be called inside a signal component');
  }
  const signal: Signal = {
    type: null,
    propKey: null,
    componentKey: currentContext.componentKey,
    value: initValue,
    id: currentContext.createSignalId(),
    containerElement: null,
    connected: false,
  };
  const getSignal = (): T => {
    if (!signal.connected) {
      return signal as unknown as T;
    } else {
      return signal.value as unknown as T;
    }
  };
  const setSignal = (value: T) => {
    signal.value = value;
    renderSignalValue(signal);
  };
  return [getSignal, setSignal] as const;
}
