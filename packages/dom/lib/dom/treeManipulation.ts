import { OneOrMany, DomCompatibleElement } from '../types';
import { validation } from './validation';

export const treeManipulation = {
    insertBefore(parent: DomCompatibleElement, node: DomCompatibleElement, child: DomCompatibleElement) {
        if (parent && child) {
            parent.insertBefore(child, node);
        }
    },
    removeSelf(elm?: OneOrMany<DomCompatibleElement>) {
        if (elm) {
            (Array.isArray(elm)) ?
                elm.forEach((node) => treeManipulation.removeSingle(node)) :
                treeManipulation.removeSingle(elm)
        }
    },
    removeSingle(e: DomCompatibleElement) {
        if (e instanceof HTMLElement) {
            e.remove();
        } else {
            e?.parentElement?.removeChild(e);
        }
    },
    appendToParent(parent: ShadowRoot | HTMLElement | Element, elem?: OneOrMany<HTMLElement | Element | Text | Node>): void {
        if (parent && elem) {
            Array.isArray(elem) ? elem.forEach((node) => parent.appendChild(node)) : parent.appendChild(elem);
        }
    },
    insertChildAfterNode(
        parent: ShadowRoot | DomCompatibleElement,
        child: OneOrMany<DomCompatibleElement>,
        node?: HTMLElement | null
    ): void {
        const children = Array.isArray(child) ? child : [child];
        if (!node) {
            const [firstNewChild, ...restChildren] = children;
            parent.insertBefore(firstNewChild, parent.firstChild);
            let referenceNode: DomCompatibleElement = firstNewChild;
            const filteredRestChildren = restChildren.filter(c => c !== null && c !== undefined);
            for (let i = 0; i < filteredRestChildren.length; i++) {
                const c = filteredRestChildren[i];
                treeManipulation.insertNodeAfter(c, referenceNode);
                referenceNode = c;
            }
        } else {
            let referenceNode: DomCompatibleElement = node;
            for (let i = 0; i < children.length; i++) {
                const c = children[i];
                treeManipulation.insertNodeAfter(c, referenceNode);
                referenceNode = c;
            }
        }
    },
    insertNodeAfter(child: DomCompatibleElement, referenceNode: DomCompatibleElement) {
        referenceNode.parentNode.insertBefore(child, referenceNode.nextSibling);
    },
    replace(parent: DomCompatibleElement, oldElement: OneOrMany<DomCompatibleElement>, newElement: OneOrMany<DomCompatibleElement>): void {
        const firstContainerNode = Array.isArray(oldElement) ? oldElement[0] : oldElement;
        const renderStartPointNode = (
            validation.isOnlyChild(firstContainerNode) ? null : firstContainerNode.previousSibling
        ) as HTMLElement | null;
        treeManipulation.removeSelf(oldElement);
        treeManipulation.insertChildAfterNode(parent, newElement, renderStartPointNode);
    },
};
