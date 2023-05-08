import { DerivedSignal } from "../../signal-core/models";


export function isDerivedSignal(s: unknown): s is DerivedSignal {
    return typeof s === 'object'
        && s !== null
        && 'id' in s
        && 'value' in s
        && 'source' in s
        && 'transformers' in s;
}


