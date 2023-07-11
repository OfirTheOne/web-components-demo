import { CreateStateFactory } from './types';
import { createStore } from './create-store';
import { signal } from '../signal/create-signal';
import { derivedSignal } from '../signal';

export function createSignalStore<S extends object>(factory: CreateStateFactory<S>) {
    const store = createStore<S>(factory);
    const stateSignal = signal(store.getState());
    store.subscribe((state) => stateSignal.setValue(() => state));
    return {
        getStore: () => store,
        select: <T>(selector:(value: S) => T) => derivedSignal<S,T>(stateSignal, selector),
    }
}