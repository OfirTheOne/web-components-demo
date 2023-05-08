import { Signal } from "../../signal-core/models";



export function isSignal(s: unknown): s is Signal {
    return typeof s === 'object' 
        && s !== null 
        && 'id' in s 
        && 'value' in s 
        && 'emitter' in s;
}
