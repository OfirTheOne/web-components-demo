import EventEmitter from 'events';
import { SignalRenderContextCommunicator } from '../render-context/signal-render-context-communicator';
import { signalIdsMemorySet } from '../../global-storage';
import { DerivedSignal, Signal } from '../models';
import { generateId } from '../../../common/generate-id';
import { reduceTransform } from '../../../common/reduce-transform';
import { memoisedFunction } from '../../../common/memoised-function';

export function createSignal<T = any>(initValue: T): Readonly<[Signal<T>, (newValue: T) => void]> {
  const currentContext = SignalRenderContextCommunicator.instance.currentContext;
  if (!currentContext) {
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
    emitter: new EventEmitter(),
  };
  const setSignal = (value: T) => {
    signal.value = value;
  };
  signalIdsMemorySet.add(signal.id);

  return [signal, setSignal] as const;
}

export function derivedSignal<S = any, N = any>(
  sourceSignal: Signal<S> | DerivedSignal<unknown, S>,
  transform: (value: S) => N
): DerivedSignal<S, N> {
  const currentContext = SignalRenderContextCommunicator.instance.currentContext;
  if (!currentContext) {
    throw new Error('createSignal must be called inside a signal component');
  }
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

  const signal: DerivedSignal<S, N> = {
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
