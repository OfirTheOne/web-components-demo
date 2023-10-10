
import { signal } from "./../create-signal";
import { ISignal } from "./../types/i-signal";

export function merge<T, T1, T2, T3, T4, T5, T6>(signal: ISignal<T>, signal1: ISignal<T1>, signal2: ISignal<T2>, signal3: ISignal<T3>, signal4: ISignal<T4>, signal5: ISignal<T5>, signal6: ISignal<T6>): ISignal<T|T1|T2|T3|T4|T5|T6>;
export function merge<T, T1, T2, T3, T4, T5>(signal: ISignal<T>, signal1: ISignal<T1>, signal2: ISignal<T2>, signal3: ISignal<T3>, signal4: ISignal<T4>, signal5: ISignal<T5>): ISignal<T|T1|T2|T3|T4|T5>;
export function merge<T, T1, T2, T3, T4>(signal: ISignal<T>, signal1: ISignal<T1>, signal2: ISignal<T2>, signal3: ISignal<T3>, signal4: ISignal<T4>): ISignal<T|T1|T2|T3|T4>;
export function merge<T, T1, T2, T3>(signal: ISignal<T>, signal1: ISignal<T1>, signal2: ISignal<T2>, signal3: ISignal<T3>): ISignal<T|T1|T2|T3>;
export function merge<T, T1, T2>(signal: ISignal<T>, signal1: ISignal<T1>, signal2: ISignal<T2>,): ISignal<T|T1|T2>;
export function merge<T, T1>(signal: ISignal<T>, signal1: ISignal<T1>): ISignal<T|T1>;
export function merge(...signals: ISignal<any>[]): ISignal<any> {
    const lastValue = signals.at(-1).value;
    const source = signal(lastValue);
    signals.forEach(signal => {
        signal.subscribe((value) => source.setValue(value));
    });
    return source;
}
