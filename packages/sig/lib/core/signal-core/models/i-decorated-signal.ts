import { ISignal } from "./i-signal";

export interface IDecoratedSignal<N=unknown> {
    id: string;
    value: N;
    readonly source: ISignal<unknown>;
    subscribe(listener: (value: N) => void): void;
    unsubscribe(listener: (value: N) => void): void;
    computeValue(): N;
}