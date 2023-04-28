import EventEmitter from 'events';
import { SignalRenderContextCommunicator } from '../render-context/signal-render-context-communicator';
import { signalIdsMemorySet } from '../../global-storage';
import { generateId } from '../../../common/generate-id';
import { Signal } from '../models';

export function createSignal<T = any>(initValue: T): Readonly<[Signal<T>, (newValue: T) => void]> {
  const currentContext = SignalRenderContextCommunicator.instance.currentContext;
  if(!currentContext) {
    throw new Error('createSignal must be called inside a signal component');
  }

  const signal: Signal<T> = {
    get value() {
      return signal._value;
    },
    set value(newValue: T) {
      signal._value = newValue;
      signal.emitter.emit('change', newValue);
    },
    _value: initValue,
    id: generateId(),
    emitter: new EventEmitter()
  };
  const setSignal = (value: T) => {
    signal.value = value;
  };
  signalIdsMemorySet.add(signal.id);

  // const signal: SignalSubscription = {
  //   type: null,
  //   propKey: null,
  //   componentKey: currentContext.componentKey,
  //   value: initValue,
  //   id: currentContext.createSignalId(),
  //   containerElement: null,
  //   connected: false,
  // };



  return [signal, setSignal] as const;
}
