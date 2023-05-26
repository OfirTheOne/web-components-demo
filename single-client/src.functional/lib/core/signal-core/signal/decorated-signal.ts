import { IDecoratedSignal, ISignal } from "../models";
import { SourceExposer } from "./source-exposer";

export class DecoratedSignal<N=unknown> implements IDecoratedSignal<N> {
    readonly source: ISignal<unknown>;

    public expose(sourceExposer: SourceExposer): SourceExposer {
        sourceExposer.set(this.source);
        return sourceExposer;
    }

    constructor(source: ISignal<unknown>) {
        this.source = source;
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