import EventEmitter from "events";

export enum SignalType {
    // Null,
    Content,
    Property,
    Event,
    Style

}
export interface SignalSubscription {
    type: SignalType | null;
    propKey: string | null;
    componentKey: string;
    id: string;
    containerElement: HTMLElement | Text| null;
    connected: boolean;
}


export interface Signal<T=unknown> {
    set value(newValue: T);
    get value(): T;
    _value: T,
    emitter: EventEmitter
    id: string;
}


export interface DerivedSignal<S =unknown, N=unknown> {
    source: Signal<S>;
    get value(): N;
    // get emitter(): EventEmitter
    get id(): string;
    transformers: Array<(value: unknown) => unknown>;  
    computeValue(): N;    

}
