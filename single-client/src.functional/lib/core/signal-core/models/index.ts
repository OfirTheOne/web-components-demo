import EventEmitter from "events";

export enum SignalSubscriptionType {
    // Null,
    ControlFlow,
    Effect,
    Content,
    Property,
    Event,
    Style

}
export interface SignalSubscriptionDetails {
    type: SignalSubscriptionType | null;
    propKey: string | null;
    componentKey: string;
    signalId: string;   
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
    setValue(setter: ((curValue: T) => T)): void;
}


export interface DerivedSignal<N=unknown> {
    source: Signal<unknown>;
    get value(): N;
    // get emitter(): EventEmitter
    get id(): string;
    transformers: Array<(value: unknown) => unknown>;  
    computeValue(): N;    

}

export type Trackable<N=unknown> = Signal<N> | DerivedSignal<N>;

export enum ControlFlow {
    Show = 'show',
    For = 'for',
    Switch = 'switch',
    Case = 'case',
    Slot = 'slot',
    Router = 'router',
    Route = 'route',
}