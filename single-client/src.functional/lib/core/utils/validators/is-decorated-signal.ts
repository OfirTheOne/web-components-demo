import { DecoratedSignal } from "../../signal-core/models";

export function isDecoratedSignal(s: unknown): s is DecoratedSignal {
    return typeof s === 'object'
        && s !== null
        && 'id' in s
        && 'value' in s
        && 'source' in s
        && 'computeValue' in s;
}
