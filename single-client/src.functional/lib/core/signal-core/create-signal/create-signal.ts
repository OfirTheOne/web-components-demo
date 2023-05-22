import EventEmitter from 'events';
// import { SignalRenderContextCommunicator } from '../render-context/signal-render-context-communicator';
import { signalIdsMemorySet } from '../../global-storage';
import { Signal } from '../models';
import { generateId } from '../../../common';

export function signal<T = any>(initValue: T): Signal<T> {
  const sourceSignal: Signal<T> = {
    get value() {
      return sourceSignal._value;
    },
    set value(newValue: T) {
      sourceSignal._value = newValue;
      sourceSignal.emitter.emit('change', newValue);
    },
    setValue(setter: ((curValue: T) => T)) {
      const newValue = setter(sourceSignal.value);
      sourceSignal.value =  newValue;
    },
    _value: initValue,
    id: generateId(),
    emitter: new EventEmitter(),
  } as const;
  signalIdsMemorySet.add(sourceSignal.id);

  return sourceSignal;
}

export function createSignal<T = any>(initValue: T): Readonly<[Signal<T>, (newValue: T) => void]> {
  const sourceSignal: Signal<T> = signal(initValue);
  const setSignal = (value: T) => {
    sourceSignal.value = value;
  };

  return [sourceSignal, setSignal] as const;
}
