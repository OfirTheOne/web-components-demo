import EventEmitter from 'events';
// import { SignalRenderContextCommunicator } from '../render-context/signal-render-context-communicator';
import { signalIdsMemorySet } from '../../global-storage';
import { DerivedSignal, Signal } from '../models';
import { reduceTransform, generateId, memoisedFunction } from '../../../common';

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

export function derivedSignal<S = any, N = any>(sourceSignal: Signal<S>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: DerivedSignal<N>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: Signal<S> | DerivedSignal<N>, transform: (value: S) => N
): DerivedSignal<N> {
  let source: Signal<S>;
  let transformers: DerivedSignal['transformers'];
  if ('transformers' in sourceSignal) {
    transformers = [...sourceSignal.transformers, transform];
    source = sourceSignal.source as Signal<S>;
  } else {
    transformers = [transform];
    source = sourceSignal;
  }

  const memoisedComputeDerivedValue = memoisedFunction(function computeDerivedSignalValue(currentSourceValue: S) {
    return reduceTransform<N>(currentSourceValue, transformers);
  });

  const signal: DerivedSignal<N> = {
    source: source as Signal<S>,
    transformers,
    get value() {
      return signal.computeValue();
    },
    get id(): string {
      return source.id;
    },
    computeValue() {
      return memoisedComputeDerivedValue(source.value);
    }
  };
  return signal;
}
