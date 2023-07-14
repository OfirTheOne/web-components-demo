import { OneOrMany } from 'src/lib/types/utils';
import { DomCompatibleElement } from '../../models/dom-element';

export class DOMUtils {
  static removeSelf(elm?: OneOrMany<HTMLElement>) {
    if (elm) {
      Array.isArray(elm) ? elm.forEach((node) => node.remove()) : elm.remove();
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
      for (let i = 0; i < restChildren.length; i++) {
        const c = restChildren[i];
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
