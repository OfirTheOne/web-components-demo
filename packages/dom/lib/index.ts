import { Ctor, OneOrMany, DomCompatibleElement } from './types';
import { SVG_TAGS, NAMESPACES, BOOLEAN_ATTRIBUTES } from "./constants/lang-spec";

const globalDom = window.document;

export const validation = {
    isElement(node: Node): node is HTMLElement {
        return node.nodeType === Node.ELEMENT_NODE;
    },
    isBooleanAttribute(attribute: string): boolean {
        return BOOLEAN_ATTRIBUTES.has(attribute);
    },
    isOnlyChild(child: DomCompatibleElement): boolean {
        return child.isConnected && child.parentNode && child.parentNode.children.length == 1;
    }
};

export const creation = {
    createTextNode(content?: string | number | boolean) {
        const nodeContent = (content === null || content === undefined) ? '' : String(content);
        return access.getGlobalDocument().createTextNode(nodeContent);
    },
    createElement<T extends HTMLElement | SVGAElement | Element = Element>(tag: string): T {
        return (SVG_TAGS.has(tag) ?
            access.getGlobalDocument().createElementNS(NAMESPACES.svg, tag) as SVGAElement :
            access.getGlobalDocument().createElement(tag)) as T;
    },
    defineCustomElement(tag: string, component: Ctor<any>, options?: ElementDefinitionOptions | undefined) {
        if (window.customElements) {
            window.customElements.define(tag, component, options);
        }
        return component;
    },
    buildShadow(elm: HTMLElement) {
        return elm.attachShadow({ mode: 'open' });
    }
};

export const access = {
    getElementById(id: string): HTMLElement | null {
        return access.getGlobalDocument().getElementById(id);
    },
    getGlobalDocument(): Document {
        return globalDom;
    },
};

export const elementManipulation = {
    setAttribute(elm: HTMLElement | SVGAElement | Element, attribute: string, value: string) {
        if (elm instanceof SVGAElement) {
            const [nsPrefix, ..._rest] = attribute.split(':');
            const ns = NAMESPACES[nsPrefix] || NAMESPACES.svg;
            elm.setAttributeNS(ns, attribute, value);
        } else {
            elm.setAttribute(attribute, value);
        }
    },
    removeAttribute(elm: HTMLElement | SVGAElement | Element, attribute: string) {
        if (elm instanceof SVGAElement) {
            const [nsPrefix, ..._rest] = attribute.split(':');
            const ns = NAMESPACES[nsPrefix] || NAMESPACES.svg;
            elm.removeAttributeNS(ns, attribute);
        } else {
            elm.removeAttribute(attribute);
        }
    },
    addClass(elm: HTMLElement | SVGAElement | Element, className: string) {
        className.split(' ').forEach((c) => elm.classList.add(c));
    },
    removeClass(elm: HTMLElement | SVGAElement | Element, className: string) {
        className.split(' ').forEach((c) => elm.classList.remove(c));
    },
    replaceClass(elm: HTMLElement | SVGAElement | Element, oldClassName: string, newClassName: string) {
        this.removeClass(elm, oldClassName);
        this.addClass(elm, newClassName);
    },
    addEventListener(elm: HTMLElement | Element, eventName: string, listener: EventListener) {
        if (elm && typeof listener === 'function') {
            elm.addEventListener(eventName, listener);
        }
    },
    removeEventListener(elm: HTMLElement | Element, eventName: string, listener: EventListener) {
        if (elm && typeof listener === 'function') {
            elm.removeEventListener(eventName, listener);
        }
    }
};

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

export const DOM = {
    validation,
    creation,
    access,
    elementManipulation,
    treeManipulation
};
