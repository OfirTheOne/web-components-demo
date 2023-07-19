import { isAllLowerCase, isSymbolShallowEquals } from './validators';
import { isCapitalEventName } from './validators/is-capital-event-name';
import { VirtualElementType } from '../../models';
import { DomElement } from '../../models/dom-element';

export class RenderUtils {

  public static appendDomProps(element: HTMLElement, propsEntries: Record<string, unknown>) {
    Object.entries(propsEntries).forEach(([name, value]) => {
      if (isCapitalEventName(name) && typeof value === 'function') {
        const eventName = name.toLowerCase().substring(2) as keyof HTMLElementEventMap;
        element.addEventListener(eventName, value as EventListener);
      } else {
        element.setAttribute(name, value.toString());
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

  public static convertStyleObjectToInlineStyle(styleObject: Record<string, unknown>): string {

    const validStyleEntries = Object.entries(styleObject).map(([name, value]) => {
      const validStyleAttr = name.startsWith('--')
        ? name
        : isAllLowerCase(name)
        ? name
        : name.replace(/(?:^\w|[A-Z]|\b-\w)/g, (match, i) =>
            i == 0 ? match.toLocaleLowerCase() : match[0] == '-' ? match.toLocaleLowerCase() : '-' + match.toLocaleLowerCase()
          );
      return [validStyleAttr, value];
    });
    return validStyleEntries.map(([key, value]) => `${key}: ${value}`).join(';');
  }

  public static handleAttributeMutation(props: Record<string, unknown>) {
    if ('className' in props) {
      props['class'] =  props['className'];
      delete props['className'];
    }
    return props;
  }
}

export function isElementType(type: symbol, elementType: VirtualElementType) {
  return isSymbolShallowEquals(type, Symbol.for(elementType));
}

export class StylePropsUtils {

  static convertNativeStylePropObjectString(stylePropObject: Record<string, unknown>): string {
    return Object
      .entries(stylePropObject)
      .map(([key, value]) => `${key}: ${value}`).join(';');
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