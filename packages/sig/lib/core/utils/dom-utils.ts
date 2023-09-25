import { OneOrMany } from '@/types';
import { DomCompatibleElement } from '../../models/dom-element';

export class DOMUtils {

  static addClass(elm: HTMLElement, className: string) {
    className.split(' ').forEach((c) => elm.classList.add(c));
  }

  static removeClass(elm: HTMLElement, className: string) {
    className.split(' ').forEach((c) => elm.classList.remove(c));
  }

  static removeSelf(elm?: OneOrMany<HTMLElement> | OneOrMany<Node>) {
    if (elm) {
      (Array.isArray(elm)) ?
        elm.forEach((node) => DOMUtils.removeSingle(node)) :
        DOMUtils.removeSingle(elm)
    }
  }

  static removeSingle(e: HTMLElement | Node) {
    if(e instanceof HTMLElement) {
      e.remove(); 
    } else {
      e?.parentElement?.removeChild(e);
    }
  }

  static buildShadow(elm: HTMLElement) {
    return elm.attachShadow({ mode: 'open' });
  }

  static appendToParent(parent: ShadowRoot | HTMLElement, elem?: OneOrMany<HTMLElement>): void {
    if (parent && elem) {
      Array.isArray(elem) ? elem.forEach((node) => parent.appendChild(node)) : parent.appendChild(elem);
    }
  }

  static insertChildAfterNode(
    parent: ShadowRoot | HTMLElement,
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

  static isOnlyChild(child: DomCompatibleElement): boolean {
    return child.isConnected && child.parentNode && child.parentNode.children.length == 1;
  }

  static replace(parent: HTMLElement, oldElement: OneOrMany<HTMLElement>, newElement: OneOrMany<HTMLElement>): void {
    const firstContainerNode = Array.isArray(oldElement) ? oldElement[0] : oldElement;
    const renderStartPointNode = (
      DOMUtils.isOnlyChild(firstContainerNode) ? null : firstContainerNode.previousSibling
    ) as HTMLElement | null;
    DOMUtils.removeSelf(oldElement);
    DOMUtils.insertChildAfterNode(parent, newElement, renderStartPointNode);
  }


}
