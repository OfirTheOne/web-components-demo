import { IDecoratedSignal } from "../../signal-core/models";

export function isDecoratedSignal(s: unknown): s is IDecoratedSignal {
    return typeof s === 'object'
        && s !== null
        && 'id' in s
        && 'value' in s
        && 'source' in s
        && 'computeValue' in s;
}
