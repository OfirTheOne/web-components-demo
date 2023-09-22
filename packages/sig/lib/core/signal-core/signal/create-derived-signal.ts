import { reduceTransform, memoisedFunction } from '@/common/utils';
import { ISignal } from '../models';
import { DecoratedSignal } from './decorated-signal';

export function derivedSignal<S = any, N = any>(sourceSignal: ISignal<S>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: DecoratedSignal<S>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: DerivedSignal<N>, transform: (value: S) => N): DerivedSignal<N>;
export function derivedSignal<S = any, N = any>(sourceSignal: ISignal<S> | DecoratedSignal<S> | DerivedSignal<S>, transform: (value: S) => N
): DerivedSignal<N> {
  return new DerivedSignal<N>(sourceSignal as ISignal<unknown>, transform);
}


export class DerivedSignal<N = unknown> extends DecoratedSignal<N> {

  readonly memoisedComputeValue: (currentSourceValue: unknown) => N;

  constructor(
      protected readonly wrappedSignal: ISignal<unknown> | DerivedSignal<unknown> | DecoratedSignal<unknown>, 
      protected readonly transform: (value: any) => N
  ) {
      super('source' in wrappedSignal ? wrappedSignal.source : wrappedSignal);
      let transformers: DerivedSignal['transform'][];
      if ('transform' in wrappedSignal) {
        transformers = [wrappedSignal.transform, transform];
      } else {
        transformers = [transform];
      }
      this.memoisedComputeValue = memoisedFunction(function computeDerivedSignalValue(currentSourceValue: unknown) {
        return reduceTransform<N>(currentSourceValue, transformers);
      });
  }

  computeValue(): N {
      return this.memoisedComputeValue(super.computeValue())
  }
}
