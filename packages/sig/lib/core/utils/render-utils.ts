import { DomElement } from '../../models/dom-element';

export class RenderUtils {

  public static appendDomProps(element: HTMLElement, props: Record<string, unknown>) {
    Object.entries(props).forEach(([name, value]) => {
      if (typeof value === 'function') {
        const eventName = name as keyof HTMLElementEventMap;
        element.addEventListener(eventName, value as EventListener);
      } else if(value !== null) {
        element.setAttribute(name, String(value));
      } else {
        element.removeAttribute(name);
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
