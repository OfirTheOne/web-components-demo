import { DomElement } from '../types';
import { BOOLEAN_ATTRIBUTES } from "../constants/lang-spec";

export const validation = {
    isElement(node: Node): node is HTMLElement {
        return node.nodeType === Node.ELEMENT_NODE;
    },
    isBooleanAttribute(attribute: string): boolean {
        return BOOLEAN_ATTRIBUTES.has(attribute);
    },
    isOnlyChild(child: DomElement): boolean {
        return child.isConnected && child.parentNode && child.parentNode.children.length == 1;
    }
};
