export interface ISignal<T=unknown>  extends ISubscribableSignal<T>, IPublisherSignal<T>{
    onUnsubscribe(unsubscribeFn: () => void): void;
    onDispose(disposeFn: () => void): void;
}

export interface ISubscribableSignal<T=unknown> {
    id: string;
    value: T;
    subscribe(listener: (value: T) => void): () => void;
    unsubscribe(listener: (value: T) => void): void;
    dispose(): void;
}

export interface IPublisherSignal<T=unknown> {
    setValue(setter: ((curValue: T) => T) | T): void;
    notify(): void;
}
