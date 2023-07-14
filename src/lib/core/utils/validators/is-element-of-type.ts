import { VirtualElementType } from '../../../models/virtual-element';

export function isSymbolShallowEquals(s1: symbol, s2: symbol) {
    return s1 === s2 || s1.description === s2.description;
  }
  

export function isElementOfType(type: symbol, elementType: VirtualElementType) {
    return isSymbolShallowEquals(type, Symbol.for(elementType));
}
