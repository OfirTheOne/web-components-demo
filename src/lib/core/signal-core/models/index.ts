
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



export interface ISignal<T=unknown> {
    id: string;
    value: T;
    setValue(setter: ((curValue: T) => T)): void;
    subscribe(listener: (value: T) => void): void;
    unsubscribe(listener: (value: T) => void): void;
    notify(): void;
}

export interface IDecoratedSignal<N=unknown> {
    id: string;
    value: N;
    readonly source: ISignal<unknown>;
    subscribe(listener: (value: N) => void): void;
    unsubscribe(listener: (value: N) => void): void;
    computeValue(): N;
}


export type AsyncFetcher<T, Args extends any[]> = (...args: Args | undefined) => Promise<T>;
export type SyncRun<Args extends any[]> = (...args: Args) => void;
export type ResourceStatus = 'pending' | 'success' | 'error';


export type Trackable<N=unknown> = ISignal<N> | IDecoratedSignal<N>;

export enum ControlFlow {
    Show = 'show',
    For = 'for',
    Switch = 'switch',
    Case = 'case',
    Slot = 'slot',
    Router = 'router',
    Route = 'route',
    Routes = 'routes',
}