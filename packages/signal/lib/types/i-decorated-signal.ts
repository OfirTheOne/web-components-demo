import { ISubscribableSignal, ISignal } from "./i-signal";

export interface IDecoratedSignal< N=unknown, S extends ISignal<N> | ISubscribableSignal<N> = ISignal<N>>  extends ISubscribableSignal<N>{
    readonly source: S;
    computeValue(): N;
}

export interface ISubscribableDecoratedSignal<N=unknown> extends ISubscribableSignal<N>{
    readonly source: ISubscribableSignal<unknown>;
    computeValue(): N;
}