import EventEmitter from 'events';
import { signalIdsMemorySet } from '../../global-storage';
import { ISignal } from '../models';
import { generateId } from '../../../common';

export function signal<T = any>(initValue: T): Signal<T> {
  return new Signal(initValue);
}

export function createSignal<T = any>(initValue: T): Readonly<[Signal<T>, (newValue: T) => void]> {
  const sourceSignal: Signal<T> = signal(initValue);
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

    constructor(initValue: T) {
        this._value = initValue;
        this.emitter = new EventEmitter();
        this.id = generateId();
        signalIdsMemorySet.add(this.id);
    }
    setValue(setter: ((curValue: T) => T)): void {
        const newValue = setter(this._value);
        this._value =  newValue;
        this.notify();
    }
    subscribe(listener: (value: T) => void) {
        this.emitter.on(VALUE_CHANGE_EVENT, listener)
    }
    unsubscribe(listener: (value: T) => void) {
        this.emitter.removeListener(VALUE_CHANGE_EVENT, listener);
    }
    notify(): void {
        this.emitter.emit(VALUE_CHANGE_EVENT, this._value);
    }
}