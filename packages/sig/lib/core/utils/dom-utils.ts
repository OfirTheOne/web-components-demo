import { Ctor, OneOrMany } from '@/types';
import { DomCompatibleElement } from '../../models/dom-element';
import { SVG_TAGS , NAMESPACES, BOOLEAN_ATTRIBUTES } from "@/constants/lang-spec";

const globalDom = window.document;

export class DOMUtils {

  // -- validation

  static isElement(node: Node): node is HTMLElement {
    return node.nodeType === Node.ELEMENT_NODE;
  }

  static isBooleanAttribute(attribute: string): boolean {
    return BOOLEAN_ATTRIBUTES.has(attribute);
  }

  static isOnlyChild(child: DomCompatibleElement): boolean {
    return child.isConnected && child.parentNode && child.parentNode.children.length == 1;
  }

  // -- creation

  static createTextNode(content?: string | number | boolean) {
    const nodeContent = (content === null || content === undefined )? '' : String(content);
    return globalDom.createTextNode(nodeContent);
  }

  static createElement<T extends HTMLElement | SVGAElement | Element = Element>(tag: string): T {
    return (SVG_TAGS.has(tag) ? 
      globalDom.createElementNS(NAMESPACES.svg, tag) as SVGAElement :
      globalDom.createElement(tag)) as T;
  }

  static defineCustomElement(tag: string, component: Ctor<any>,  options?: ElementDefinitionOptions | undefined) {
    if(window.customElements) {
      window.customElements.define(tag, component, options);
    }
    return component;
  }

  static buildShadow(elm: HTMLElement) {
    return elm.attachShadow({ mode: 'open' });
  }

  // -- access

  static getElementById(id: string): HTMLElement | null {
    return globalDom.getElementById(id);
  }

  static getGlobalDocument(): Document {
    return globalDom;
  }

  // -- self manipulation

  static setAttribute(elm: HTMLElement | SVGAElement | Element, attribute: string, value: string) {
    if(elm instanceof SVGAElement) {
      const [nsPrefix, ..._rest] = attribute.split(':');
      const ns = NAMESPACES[nsPrefix] || NAMESPACES.svg;
      elm.setAttributeNS(ns, attribute, value);
    } else {
      elm.setAttribute(attribute, value);
    }
  }

  static removeAttribute(elm: HTMLElement | SVGAElement | Element, attribute: string) {
    if(elm instanceof SVGAElement) {
      const [nsPrefix, ..._rest] = attribute.split(':');
      const ns = NAMESPACES[nsPrefix] || NAMESPACES.svg;
      elm.removeAttributeNS(ns, attribute);
    } else {
      elm.removeAttribute(attribute);
    }
  }

  static addClass(elm: HTMLElement | SVGAElement | Element, className: string) {
    className.split(' ').forEach((c) => elm.classList.add(c));
  }

  static removeClass(elm: HTMLElement | SVGAElement | Element, className: string) {
    className.split(' ').forEach((c) => elm.classList.remove(c));
  }

  static replaceClass(elm: HTMLElement | SVGAElement | Element, oldClassName: string, newClassName: string) {
    this.removeClass(elm, oldClassName);
    this.addClass(elm, newClassName);
  }

  static addEventListener(elm: HTMLElement | Element, eventName: string, listener: EventListener) {
    if (elm && typeof listener === 'function') {
      elm.addEventListener(eventName, listener);
    }
  }

  static removeEventListener(elm: HTMLElement | Element, eventName: string, listener: EventListener) {
    if (elm && typeof listener === 'function') {
      elm.removeEventListener(eventName, listener);
    }
  }

  // -- tree manipulation

  static insertBefore(parent: DomCompatibleElement, node: DomCompatibleElement, child: DomCompatibleElement) {
    if (parent && child) {
      parent.insertBefore(child, node);
    }
  }

  static removeSelf(elm?: OneOrMany<DomCompatibleElement>) {
    if (elm) {
      (Array.isArray(elm)) ?
        elm.forEach((node) => DOMUtils.removeSingle(node)) :
        DOMUtils.removeSingle(elm)
    }
  }

  static removeSingle(e: DomCompatibleElement) {
    if(e instanceof HTMLElement) {
      e.remove(); 
    } else {
      e?.parentElement?.removeChild(e);
    }
  }

  static appendToParent(parent: ShadowRoot | HTMLElement | Element, elem?: OneOrMany<HTMLElement | Element | Text | Node>): void {
    if (parent && elem) {
      Array.isArray(elem) ? elem.forEach((node) => parent.appendChild(node)) : parent.appendChild(elem);
    }
  }

  static insertChildAfterNode(
    parent: ShadowRoot | DomCompatibleElement,
    child: OneOrMany<DomCompatibleElement>,
    node?: HTMLElement | null
  ): void {
    const children = Array.isArray(child) ? child : [child];
    if (!node) {
      const [firstNewChild, ...restChildren] = children;
      parent.insertBefore(firstNewChild, parent.firstChild);
      let referenceNode: DomCompatibleElement = firstNewChild;
      const filteredRestChildren = restChildren.filter(c => c !== null && c  !== undefined);
      for (let i = 0; i < filteredRestChildren.length; i++) {
        const c = filteredRestChildren[i];
        this.insertNodeAfter(c, referenceNode);
        referenceNode = c;
      }
    } else {
      let referenceNode: DomCompatibleElement = node;
      for (let i = 0; i < children.length; i++) {
        const c = children[i];
        this.insertNodeAfter(c, referenceNode);
        referenceNode = c;
      }
    }
  }

  static insertNodeAfter(child: DomCompatibleElement, referenceNode: DomCompatibleElement) {
    referenceNode.parentNode.insertBefore(child, referenceNode.nextSibling);
  }

  static replace(parent: DomCompatibleElement, oldElement: OneOrMany<DomCompatibleElement>, newElement: OneOrMany<DomCompatibleElement>): void {
    const firstContainerNode = Array.isArray(oldElement) ? oldElement[0] : oldElement;
    const renderStartPointNode = (
      DOMUtils.isOnlyChild(firstContainerNode) ? null : firstContainerNode.previousSibling
    ) as HTMLElement | null;
    DOMUtils.removeSelf(oldElement);
    DOMUtils.insertChildAfterNode(parent, newElement, renderStartPointNode);
  }
}
