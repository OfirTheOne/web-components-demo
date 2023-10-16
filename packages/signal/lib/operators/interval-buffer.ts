
import { signal } from "./../create-signal";
import { ISignal } from "./../types/i-signal";


export function intervalBuffer<T>(sourceSignal: ISignal<T>, interval: number, takeLast: true): ISignal<T>;
export function intervalBuffer<T>(sourceSignal: ISignal<T>, interval: number, takeLast: false | undefined): ISignal<T[]>;
export function intervalBuffer<T>(sourceSignal: ISignal<T>, interval: number): ISignal<T[]>
export function intervalBuffer<T>(sourceSignal: ISignal<T>, interval: number, takeLast?: boolean): ISignal<T[] | T> {
    const source = signal<T[] | T>();
    const buffer: T[] = [];
    let timeout: NodeJS.Timeout;
    sourceSignal.subscribe((value) => {
        buffer.push(value);
        if (timeout === undefined) {
            timeout = setTimeout(() => {
                if (takeLast) {
                    source.setValue(buffer.at(-1));
                } else {
                    source.setValue(buffer);
                }
                buffer.length = 0;
                timeout = undefined;
            }, interval);
        }
    });
    sourceSignal.onDispose(() => {
        buffer.length = 0;
        source.dispose();
    });
    return source;
}