

import { debounce as debounceUtil } from "../utils/debounce";
import { signal as createSignal } from "./../create-signal";
import { ISignal } from "./../types/i-signal";

export function debounce<T=unknown>(signal: ISignal<T>, ms: number): ISignal<T> {
    const source = createSignal(signal.value);
    const listener = debounceUtil((value) => {
        source.setValue(() => value);
    }, ms);
    signal.subscribe(listener);
    source.onDispose(() => signal.unsubscribe(listener));
    return source
}
