import EventEmitter from 'events';
// import { signalIdsMemorySet } from '../../global-storage';
import { ISignal } from './types/i-signal';
import { generateId } from './utils';
import { isCallback } from './utils/is-callback';

declare global {
    interface Window {
        __SIG: {
            signaledContextMemoryMap: Map<string, unknown>,
            signalIdsMemorySet: Set<string>,
        }
    }
}
const signalIdsMemorySet = window.__SIG['signalIdsMemorySet'];

export function signal<T = any>(initValue: T): ISignal<T> {
  return new Signal(initValue);
}

export function createSignal<T = any>(initValue: T): Readonly<[ISignal<T>, ISignal<T>['setValue']]> {
  const sourceSignal: ISignal<T> = signal(initValue);
  const setSignal = sourceSignal.setValue.bind(sourceSignal);
  return [sourceSignal, setSignal] as const;
}


const VALUE_CHANGE_EVENT = 'change';

export class Signal<T = unknown> implements ISignal<T> {

    private _value: T
    public get value(): T {
        return this._value;
    }
    public readonly id: string;
    public readonly emitter: EventEmitter;
    public readonly _onUnsubscribe: (() => void)[] = [];
    readonly _onDispose: (() => void)[] = [];
    

    constructor(initValue: T) {
        this._value = initValue;
        this.emitter = new EventEmitter();
        this.id = generateId();
        signalIdsMemorySet.add(this.id);
    }
    setValue(setter: ((curValue: T) => T) | T): void {
        
        const newValue = isCallback(setter) ? setter(this._value) : setter ;
        this._value =  newValue;
        this.notify();
    }
    subscribe(listener: (value: T) => void) {
        this.emitter.on(VALUE_CHANGE_EVENT, listener);
        return () => this.unsubscribe(listener);
    }
    unsubscribe(listener: (value: T) => void) {
        this.emitter.removeListener(VALUE_CHANGE_EVENT, listener);
        try {
            this._onUnsubscribe.forEach(unsubscribe => unsubscribe());
        } catch (error) {
            console.error(error);
        }
    }
    notify(): void {
        this.emitter.emit(VALUE_CHANGE_EVENT, this._value);
    }
    
    onUnsubscribe(unsubscribeFn: () => void): void {
        this._onUnsubscribe.push(unsubscribeFn);
    }
    onDispose(disposeFn: () => void): void {
        this._onDispose.push(disposeFn);
    }
    dispose(): void {
        this.emitter.removeAllListeners();
        signalIdsMemorySet.delete(this.id);
        try {
            this._onDispose.forEach(dispose => dispose());
        } catch (error) {
            console.error(error);
        }
    }
}
