import { isAllLowerCase, isSymbolShallowEquals } from './common-utils';
import { isCapitalEventName } from './is-capital-event-name';
import { VirtualElementType } from '../../models';
import { DomElement } from '../../models/dom-element';
import { Signal, isSignal } from '../signal/render-context/signal-render-context';

export class RenderUtils {

  public static appendDomProps(element: HTMLElement, propsEntries: Array<[string, any]>) {
    propsEntries.forEach(([name, value]) => {
      if (isCapitalEventName(name)) {
        const eventName = name.toLowerCase().substring(2) as keyof HTMLElementEventMap;
        element.addEventListener(eventName, value);
      } else {
        element.setAttribute(name, value.toString());
      }
    });
  }
  public static appendSignalDomProps(element: HTMLElement, propsEntries: Array<[string, any]>) {
    propsEntries.forEach(([name, value]) => {      
      if (isCapitalEventName(name)) {
        const eventName = name.toLowerCase().substring(2) as keyof HTMLElementEventMap;
        element.addEventListener(eventName, value);
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

  public static renderText(child?: string) {
    return document.createTextNode(child || '');
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

  public static handleAttributeMutation(propsEntries: [string, any][]) {
    const classnameIndex = propsEntries.findIndex(([key]) => key.toLocaleLowerCase() === 'classname');
    if (classnameIndex > -1) {
      propsEntries[classnameIndex] = ['class', propsEntries[classnameIndex][1]];
    }
    return propsEntries;
  }
}

export function isElementType(type: symbol, elementType: VirtualElementType) {
  return isSymbolShallowEquals(type, Symbol.for(elementType));
}
