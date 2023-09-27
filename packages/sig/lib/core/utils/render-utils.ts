import { BOOLEAN_ATTRIBUTES } from '@/constants';
import { DomElement } from '@/models/dom-element';
import { DOMUtils } from './dom-utils';
export class RenderUtils {

  public static appendDomProps(element: Element, props: Record<string, unknown>) {
    Object.entries(props).forEach(([name, value]) => {
      if (typeof value === 'function') {
        const eventName = name as keyof HTMLElementEventMap;
        element.addEventListener(eventName, value as EventListener);
      } else if(value !== null) {
        if(BOOLEAN_ATTRIBUTES.has(name)) {
          if (value !== false &&
              value !== undefined) {
            DOMUtils.addAttributes(element, name, '');
          }
        } else {
          DOMUtils.addAttributes(element, name, String(value));
        }
      } else {
        DOMUtils.removeAttributes(element, name);
      }
    });
  }

  public static appendDomChildren(parent: HTMLElement, child: DomElement) {
    if (child) {
      const children = Array.isArray(child) ? child : [child];
      children.forEach((nestedChild) => {
        if (nestedChild) {
          parent.appendChild(typeof nestedChild !== 'string' ? nestedChild : this.renderText(nestedChild));
        }
      });
    }
  }

  public static renderText(child?: string | number | boolean) {
    const nodeContent = (child === null || child === undefined )? '' : `${child}`;
    return document.createTextNode(nodeContent);
  }
}
