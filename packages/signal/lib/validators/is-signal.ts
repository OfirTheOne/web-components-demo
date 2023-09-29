import { ISignal } from "../types/i-signal";

export function isSignal(s: unknown): s is ISignal {
    return typeof s === 'object' 
        && s !== null 
        && 'id' in s 
        && 'value' in s 
        && 'subscribe' in s;
}
