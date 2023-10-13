import { ISignal, ISubscribableSignal } from "./types/i-signal";
import { IDecoratedSignal } from "./types/i-decorated-signal";

export class DecoratedSignal<N=unknown, S extends ISignal<N> | ISubscribableSignal<N> = ISignal<N>> implements IDecoratedSignal<N, S> {
    get value(): N {
        return this.computeValue();
    }
    get id(): string {
        return this.source.id;
    }
    readonly source: S;
    protected wrappedListenersToOriginal: Map<((value: N) => void), (value: unknown) => void> = new Map();

    constructor(source: S) {
        this.source = source;
    }
    subscribe(listener: (value: N) => void): () => void {
        const wrappedListener = () => listener(this.computeValue())
        this.wrappedListenersToOriginal.set(listener, wrappedListener);
        this.source.subscribe(wrappedListener);
        return () => this.unsubscribe(wrappedListener);
    }
    dispose(): void {
        this.wrappedListenersToOriginal.forEach((wrappedListener, originalListener) => {    
            this.source.unsubscribe(wrappedListener);
            this.wrappedListenersToOriginal.delete(originalListener);
        });
    }
    unsubscribe(listener: (value: N) => void): void {
        const wrappedListener = this.wrappedListenersToOriginal.get(listener);
        if (wrappedListener) {
            this.source.unsubscribe(wrappedListener);
        }
    }
    computeValue(): N {
        return this.source.value as N;
    }  
}