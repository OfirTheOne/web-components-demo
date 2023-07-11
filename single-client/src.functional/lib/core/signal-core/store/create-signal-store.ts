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
        getSignal: <T>(selector:(value: S) => T) => derivedSignal<S,T>(stateSignal, selector),
    }
}


/*
function createSingleProxy<T extends object>(obj: T): T {
    const handler: ProxyHandler<T> = {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'function') {
            return value;
        }
        if (typeof value === "object" && value !== null) {
          return createSingleProxy(value);
        }
        return value;
      },
      set(target, prop, value, receiver) {
        
        return false;
      },
    };
    let proxy = obj as T & { __proxy?: T };
    if (!proxy.__proxy) {
      proxy = new Proxy(obj, handler);
      proxy.__proxy = proxy;
    }
    return proxy.__proxy;
  }

  */