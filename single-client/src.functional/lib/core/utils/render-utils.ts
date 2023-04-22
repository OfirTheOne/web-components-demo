import { VirtualRender } from '../types';
import { Logger } from '../../common/logger';
import { ComponentContainer } from '../component-container/component-container';
import { renderContextMemoryMap } from '../global-storage';
import { isAllLowerCase, isSymbolShallowEquals } from './common-utils';
import { isCapitalEventName } from './is-capital-event-name';
import { Props, VirtualElement, VirtualElementType } from '../../models';
import { DomElement } from '../../models/dom-element';
import { EqualFn } from '../../models/equal-fn';
import { OneOrMany } from '../../types/utils';
import { FnComponent } from '../../models/fn-component';

export class RenderUtils {
  public static handleMemoComponentElement(
    virtualRender: VirtualRender,
    parent: HTMLElement,
    tag: FnComponent,
    props: Props,
    children: Array<string | VirtualElement>,
    key: string
  ) {
    const existingComponentContainer = renderContextMemoryMap.get(key)?.componentContainerRef as ComponentContainer;
    const isMounted = existingComponentContainer && existingComponentContainer.wasRenderedBefore; 
    let shouldRenderMemo = false;
    if(isMounted) {
      const areEqual = tag['_areEqual_'] as EqualFn;
      if(!areEqual || typeof areEqual !== 'function' ) {
        throw new Error('Memo function must have an _areEqual_ function');
      }
      const arePropsEqual = areEqual(existingComponentContainer.props, props);
      // const areChildrenEqual = areEqual(existingComponentContainer.children, children);
      if(arePropsEqual) {
        shouldRenderMemo = true;
      } 
    }
    if(shouldRenderMemo) {
      Logger.logAction('memoRender', `element ${tag.name}, key ${key}.`);
      existingComponentContainer.setParent(parent);
      existingComponentContainer.connectOnMount(existingComponentContainer.container)
      return existingComponentContainer.container;
    } else {
      
      return RenderUtils.handleComponentElement(virtualRender, parent, tag, props, children, key);
    }
  }
  public static handleComponentElement(
    virtualRender: VirtualRender,
    parent: HTMLElement,
    tag: FnComponent,
    props: Props,
    children: Array<string | VirtualElement>,
    key: string
  ): OneOrMany<HTMLElement> {
    const existingComponentContainer = renderContextMemoryMap.get(key)?.componentContainerRef as ComponentContainer;
    if (!existingComponentContainer) {
      Logger.logAction('componentInit', `element ${tag.name}, key ${key}.`);
    }
    const componentContainer = (
      existingComponentContainer || new ComponentContainer(tag, props, children, key, parent, undefined, {}, virtualRender)
    )
      .setProps(props)
      .setChildren(children);
    Logger.logAction('render', `element ${tag.name}, key ${key}.`);
    const rendered = componentContainer.render();
    if (rendered == null) {
      Logger.logAction('unmounted', `element ${tag.name}, key ${key}.`);
      componentContainer.onUnmount();
    }
    return rendered;
  }

  public static handleNativeTagElement(tag: string, props: Props) {
    const element = document.createElement(tag);
    if (props) {
      const nonEmptyProps = props;
      const styleProp = <Record<string, unknown>>nonEmptyProps['style'];
      const refProp = <(e: HTMLElement) => void>nonEmptyProps['ref'];
      const propsEntries = Object.entries(nonEmptyProps).filter(([propKey]) => !['style', 'ref'].includes(propKey));
      const mutatedPropsEntries = RenderUtils.handleAttributeMutation(propsEntries);
      if (styleProp && typeof styleProp == 'object') {
        element.setAttribute('style', RenderUtils.convertStyleObjectToInlineStyle(styleProp));
      }
      if (refProp && typeof refProp === 'function') {
        refProp(element);
      }
      RenderUtils.appendDomProps(element, mutatedPropsEntries);
    }
    return element;
  }

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
