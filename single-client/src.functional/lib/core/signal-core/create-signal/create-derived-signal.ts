import { reduceTransform, memoisedFunction } from '../../../common';
import { DecoratedSignal, DerivedSignal, Signal } from "../models";

export function derivedSignal<S = any, N = any>(sourceSignal: Signal<S>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: DecoratedSignal<S>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: DerivedSignal<N>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: Signal<S> | DecoratedSignal<S> | DerivedSignal<N>, transform: (value: S) => N
): DerivedSignal<N> {
  let source: Signal<S>;
  let transformers: DerivedSignal['transformers'];
  if ('transformers' in sourceSignal) {
    transformers = [...sourceSignal.transformers, transform];
    source = sourceSignal.source as Signal<S>;
  } else if('source' in sourceSignal) {
    transformers = [transform];
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
