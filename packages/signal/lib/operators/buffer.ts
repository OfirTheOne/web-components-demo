
import { signal } from "./../create-signal";
import { ISignal } from "./../types/i-signal";


export function buffer<T>(sourceSignal: ISignal<T>, bufferSize: number, takeLast: true): ISignal<T>;
export function buffer<T>(sourceSignal: ISignal<T>, bufferSize: number, takeLast: false | undefined): ISignal<T[]>;
export function buffer<T>(sourceSignal: ISignal<T>, bufferSize: number): ISignal<T[]> 
export function buffer<T>(sourceSignal: ISignal<T>, bufferSize: number, takeLast?: boolean): ISignal<T[] | T> {
    const source = signal<T[] | T>();
    const buffer: T[] = [];
    sourceSignal.subscribe((value) => {
        buffer.push(value);
        if (buffer.length == bufferSize) {
            if (takeLast) {
                source.setValue(buffer.at(-1));
            } else {
                source.setValue(buffer);
            }
            buffer.length = 0;
        }
    });
    sourceSignal.onDispose(() => {
        buffer.length = 0;
        source.dispose();
    });
    return source;
}