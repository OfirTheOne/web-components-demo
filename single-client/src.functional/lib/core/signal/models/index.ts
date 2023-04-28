import EventEmitter from "events";

export enum SignalType {
    // Null,
    Content,
    // Attribute,
    Property,
    Event,
    Style

}
export interface SignalSubscription {
    type: SignalType | null;
    propKey: string | null;
    componentKey: string;
    // value: unknown;
    id: string;
    containerElement: HTMLElement | null;
    connected: boolean;
}


export interface Signal<T=unknown> {
    set value(newValue: T);
    get value(): T;
    _value: T,
    emitter: EventEmitter
    id: string;
}
