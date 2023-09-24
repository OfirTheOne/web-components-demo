import { ISignal } from "./types/i-signal";
import { IDecoratedSignal } from "./types/i-decorated-signal";

export class DecoratedSignal<N=unknown> implements IDecoratedSignal<N> {
    readonly source: ISignal<unknown>;
    protected wrappedListenersToOriginal: WeakMap<((value: N) => void), (value: unknown) => void> = new WeakMap();

    constructor(source: ISignal<unknown>) {
        this.source = source;
    }

    subscribe(listener: (value: N) => void) {
        const wrappedListener = () => listener(this.computeValue())
        this.wrappedListenersToOriginal.set(listener, wrappedListener);
        this.source.subscribe(wrappedListener);
    }
    unsubscribe(listener: (value: N) => void): void {
        const wrappedListener = this.wrappedListenersToOriginal.get(listener);
        if (wrappedListener) {
            this.source.unsubscribe(wrappedListener);
        }
    }
    get value(): N {
        return this.computeValue();
    }
    get id(): string {
        return this.source.id;
    }
    computeValue(): N {
        return this.source.value as N;
    }  
}