import { IDecoratedSignal } from "./i-decorated-signal";
import { ISignal } from "./i-signal";

export type Trackable<N=unknown> = ISignal<N> | IDecoratedSignal<N>;
