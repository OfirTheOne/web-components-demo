import { isAllLowerCase, isSymbolShallowEquals } from './validators';
import { isCapitalEventName } from './validators/is-capital-event-name';
import { VirtualElementType } from '../../models';
import { DomElement } from '../../models/dom-element';

export class RenderUtils {

  public static appendDomProps(element: HTMLElement, props: Record<string, unknown>) {
    Object.entries(props).forEach(([name, value]) => {
      if (typeof value === 'function') {
        const eventName = name as keyof HTMLElementEventMap;
        element.addEventListener(eventName, value as EventListener);
      } else {
        element.setAttribute(name, String(value));
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

export function isElementType(type: symbol, elementType: VirtualElementType) {
  return isSymbolShallowEquals(type, Symbol.for(elementType));
}

export class StylePropsUtils {

  static convertNativeStylePropObjectString(stylePropObject: Record<string, unknown>): string {
    return stylePropObject ? Object
      .entries(stylePropObject)
      .map(([key, value]) => `${key}: ${value}`).join(';') : ''
  }

  static convertStylePropObjectToNativeStylePropObject(stylePropObject: Record<string, unknown>): Record<string, unknown> {
    return Object
      .entries(stylePropObject)
      .map<[string, unknown]>(([name, value]) => 
          [StylePropsUtils.convertStylePropNameToNativeStylePropName(name), value])
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), <Record<string, unknown>>{});
  }

  static convertStylePropNameToNativeStylePropName(stylePropName: string) {
    return stylePropName.startsWith('--')
        ? stylePropName
        : isAllLowerCase(stylePropName)
        ? stylePropName 
        : stylePropName.replace(/(?:^\w|[A-Z]|\b-\w)/g, (match, i) =>
            i == 0 
            ? match.toLocaleLowerCase()
            : match[0] == '-' 
            ? match.toLocaleLowerCase() 
            : '-' + match.toLocaleLowerCase()
        );
  }
}

export class EventPropsUtils {
  static mutateEventProps(props: Record<string, unknown>) {
      Object.entries(props).forEach(([name, value]) => {

      if (isCapitalEventName(name) && typeof value === 'function') {
        const eventName = name.toLowerCase().substring(2) as keyof HTMLElementEventMap;
        props[eventName] = value;
        delete props[name];
      }
    });
    return props;
  }
}

export class BasicPropsUtils {
  static mutateBasicProps(props: Record<string, unknown>) {
      Object.entries(props).forEach(([name, value]) => {
        if (name === 'className') {
          props['class'] =  value;
          delete props['className'];
        }
    });
    return props;
  }
}