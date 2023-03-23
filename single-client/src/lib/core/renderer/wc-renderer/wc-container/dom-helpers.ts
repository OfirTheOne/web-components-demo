import { DomCompatibleElement } from "../../../../models/dom-element";


export class DOMHelpers {
  static removeSelf(elm?: HTMLElement | HTMLElement[]) {
    if (elm) {
      Array.isArray(elm) ? elm.forEach((node) => node.remove()) : elm.remove();
    }
  }

  static buildShadow(elm: HTMLElement) {
    return elm.attachShadow({ mode: "open" });
  }

  static appendToParent(parent: ShadowRoot | HTMLElement, elem?: HTMLElement | HTMLElement[]): void {
    if(parent && elem) {
      Array.isArray(elem)
        ? elem.forEach((node) => parent.appendChild(node))
        : parent.appendChild(elem);
    }
  }

  // static insertChildAtIndex(parent: ShadowRoot | HTMLElement, child: HTMLElement, index: number = 0): void {
  //   if (index >= parent.children.length) {
  //     parent.appendChild(child)
  //   } else {
  //     parent.insertBefore(child, parent.children[index])
  //   }
  // }

  static insertChildAfterNode(parent: ShadowRoot | HTMLElement, child: DomCompatibleElement | DomCompatibleElement[], node?: HTMLElement | null): void {
    const children = Array.isArray(child)? child : [child]
    if (!node) {
      children.forEach((c) => {
        parent.appendChild(c);
      });
    } else {
      let referenceNode: DomCompatibleElement = node;
      for(let i = 0; i < children.length; i++) {
        const c = children[i];
        this.insertNodeAfter(c, referenceNode);
        referenceNode = c;
      }
    }
  }

  static insertNodeAfter(child: DomCompatibleElement, referenceNode: DomCompatibleElement) {
    referenceNode.parentNode.insertBefore(child, referenceNode.nextSibling);
}
}
