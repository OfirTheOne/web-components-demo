import { reduceTransform, memoisedFunction } from './utils';
import { ISignal, ISubscribableSignal } from './types/i-signal';
import { IDecoratedSignal } from './types/i-decorated-signal';
import { DecoratedSignal } from './decorated-signal';

export function derivedSignal<S = any, N = any>(sourceSignal: ISubscribableSignal<S>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: DecoratedSignal<S, ISubscribableSignal<S>>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: DerivedSignal<N>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: ISubscribableSignal<S> | DecoratedSignal<S, ISubscribableSignal<S>> | DerivedSignal<S>, transform: (value: S) => N
): DerivedSignal<N> {
  return new DerivedSignal<N>(sourceSignal as ISignal<unknown>, transform);
}

export class DerivedSignal<N = unknown> extends DecoratedSignal<N, ISubscribableSignal<N>> {

  readonly memoisedComputeValue: (currentSourceValue: unknown) => N;

  constructor(
      protected readonly wrappedSignal: 
        ISubscribableSignal<unknown> | 
        DerivedSignal<unknown> | 
        IDecoratedSignal<unknown, ISubscribableSignal>, 
      protected readonly transform: (value: any) => N
  ) {
      super(('source' in wrappedSignal ? wrappedSignal.source : wrappedSignal) as ISubscribableSignal<N>);
      const transformers: DerivedSignal['transform'][] = [transform];
      if ('transform' in wrappedSignal) {
        transformers.unshift(wrappedSignal.transform);
      }
      this.memoisedComputeValue = memoisedFunction(function computeDerivedSignalValue(currentSourceValue: unknown) {
        return reduceTransform<N>(currentSourceValue, transformers);
      });
  }

  computeValue(): N {
      return this.memoisedComputeValue(super.computeValue())
  }
}
