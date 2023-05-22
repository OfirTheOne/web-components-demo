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

export interface DecoratedSignal<N=unknown> {
    source: Signal<unknown>;
    get value(): N;
    get id(): string;
    computeValue(): N;    
}


export interface DerivedSignal<N=unknown> extends DecoratedSignal<N> {
    transformers: Array<(value: unknown) => unknown>;  
}

export type AsyncFetcher<T, Args extends any[]> = (...args: Args | undefined) => Promise<T>;
export type SyncRun<Args extends any[]> = (...args: Args) => void;
export type ResourceStatus = 'pending' | 'success' | 'error';

export interface ResourceSignal<
    T = any, 
    Args extends any[] = any[], 
    F extends AsyncFetcher<T, Args> = AsyncFetcher<T, Args>,
> extends DecoratedSignal<T> {
    readonly fetcherRef: F;
    error: Error | null;
    status: ResourceStatus;
    run: SyncRun<Args>;
}

export type Trackable<N=unknown> = Signal<N> | DecoratedSignal<N>;

export enum ControlFlow {
    Show = 'show',
    For = 'for',
    Switch = 'switch',
    Case = 'case',
    Slot = 'slot',
    Router = 'router',
    Route = 'route',
}