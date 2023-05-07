import { VirtualElementType } from '../../../models/virtual-element';
import { isSymbolShallowEquals } from '../common-utils';

export function isElementOfType(type: symbol, elementType: VirtualElementType) {
    return isSymbolShallowEquals(type, Symbol.for(elementType));
}
