export interface ISignal<T=unknown> {
    id: string;
    value: T;
    readonly onUnsubscribe: (() => void)[];
    setValue(setter: ((curValue: T) => T) | T): void;
    subscribe(listener: (value: T) => void): void;
    unsubscribe(listener: (value: T) => void): void;
    notify(): void;
}
