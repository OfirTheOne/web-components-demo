import { IDecoratedSignal } from "./i-decorated-signal";
import { ISubscribableSignal, ISignal } from "./i-signal";

export type Trackable<N=unknown> =  ISignal<N> | ISubscribableSignal<N> | IDecoratedSignal<N>;
