import { createStore, Store, CreateStateFactory } from '@/common';
import { DerivedSignal, derivedSignal, signal } from '../signal';


export interface SignalStore<S extends object> extends Store<S> {
    select: <T>(selector: (value: S) => T) => DerivedSignal<T>
}

export function createSignalStore<S extends object>(factory: CreateStateFactory<S>): SignalStore<S> {
    const store = createStore<S>(factory);
    const stateSignal = signal(store.getState());
    store.subscribe((state) => stateSignal.setValue(() => state));
    return {
        ...store,
        select: <T>(selector:(value: S) => T) => derivedSignal<S,T>(stateSignal, selector),
    };
}