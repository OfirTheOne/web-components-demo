
import { signal } from "./../create-signal";
import { ISignal } from "./../types/i-signal";

export function map<I=unknown, O=unknown>(inputSignal: ISignal<I>, mapper: (value: I) => O): ISignal<O> {
    const source = signal(mapper(inputSignal.value));
    inputSignal.subscribe((value) => source.setValue(mapper(value)));
    inputSignal.onDispose(() => source.dispose());
    return source;
}


