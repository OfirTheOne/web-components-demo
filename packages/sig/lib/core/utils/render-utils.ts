import { DOMUtils } from './dom-utils';
import { DomElement, VirtualElement } from '@/models';
import { OneOrMany } from '@/types';
export class RenderUtils {

  static isVirtualElement(child: unknown): child is VirtualElement {
    return child !== null && 
      typeof child === 'object' && 
      'tag' in child && 
      'props' in child && 
      'children' in child;
  }

  public static appendDomProps(element: Element, props: Record<string, unknown>) {
    Object.entries(props).forEach(([name, value]) => {
      if (typeof value === 'function') {
        DOMUtils.addEventListener(element, name, value as EventListener);
      } else if(value !== null) {
        if(DOMUtils.isBooleanAttribute(name)) {
          if (value !== false && value !== undefined) {
            DOMUtils.setAttribute(element, name, '');
          }
        } else {
          DOMUtils.setAttribute(element, name, String(value));
        }
      } else {
        DOMUtils.removeAttribute(element, name);
      }
    });
  }

  public static appendDomChildren(parent: HTMLElement, child?: OneOrMany<null | undefined | string | DomElement>) {
    if (child) {
      const children = Array.isArray(child) ? child : [child];
      children.forEach((nestedChild) => {
        if (nestedChild) {
          DOMUtils.appendToParent(parent, typeof nestedChild !== 'string' ? nestedChild : DOMUtils.createTextNode(nestedChild));
        }
      });
    }
  }

  public static renderText(child?: string | number | boolean) {
    return DOMUtils.createTextNode(child);
  }

  public static createElementPlaceholder = (tagName: string, key: string) => {
    const ph = DOMUtils.createElement<HTMLElement>(tagName);
    DOMUtils.setAttribute(ph, 'role', 'ph');
    DOMUtils.setAttribute(ph, 'for', key);
    ph.style.display = 'none';
    ph.style.visibility = 'hidden';
    return ph;
 }
 
}
