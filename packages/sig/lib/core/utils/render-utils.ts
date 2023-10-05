import { DomElement, VirtualElement } from '@/models';
import { OneOrMany } from '@/types';
import { DOM } from '@sig/dom';
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
        DOM.elementManipulation.addEventListener(element, name, value as EventListener);
      } else if (value !== null) {
        if (DOM.validation.isBooleanAttribute(name)) {
          if (value !== false && value !== undefined) {
            DOM.elementManipulation.setAttribute(element, name, '');
          }
        } else {
          if (name === 'class') {
            DOM.elementManipulation.addClass(element, value as string);
          } else {
            DOM.elementManipulation.setAttribute(element, name, String(value));
          }
        }
      } else {
        DOM.elementManipulation.removeAttribute(element, name);
      }
    });
  }

  public static appendDomChildren(parent: HTMLElement, child?: OneOrMany<null | undefined | string | DomElement>) {
    if (child) {
      const children = Array.isArray(child) ? child : [child];
      children.forEach((nestedChild) => {
        if (nestedChild) {
          DOM.treeManipulation.appendToParent(parent, typeof nestedChild !== 'string' ? nestedChild : DOM.creation.createTextNode(nestedChild));
        }
      });
    }
  }

  public static renderText(child?: string | number | boolean) {
    return DOM.creation.createTextNode(child);
  }

  public static createElementPlaceholder = (tagName: string, key: string) => {
    const ph = DOM.creation.createElement<HTMLElement>(tagName);
    DOM.elementManipulation.setAttribute(ph, 'role', 'ph');
    DOM.elementManipulation.setAttribute(ph, 'for', key);
    ph.style.display = 'none';
    ph.style.visibility = 'hidden';
    return ph;
  }

}
