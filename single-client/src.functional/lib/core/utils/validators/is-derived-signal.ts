import { DerivedSignal } from "../../signal-core/signal";


export function isDerivedSignal(s: unknown): s is DerivedSignal {
    return typeof s === 'object'
        && s !== null
        && 'id' in s
        && 'value' in s
        && 'source' in s
        && 'transform' in s
        && 'computeValue' in s;
}