import { VirtualRender } from '../types';
import { isCapitalEventName } from './is-capital-event-name';
import { Props, VirtualElement, VirtualElementType } from '../../models';
import { DomElement } from '../../models/dom-element';
import { Logger } from '../../common/logger';
import { ComponentContainer } from '../component-container/component-container';
import { isAllLowerCase, isSymbolShallowEquals } from './common-utils';
import { RenderSignal } from '../render-signal/render-signal';
import { renderContextMemoryMap } from '../global-storage';

export class RenderUtils {
    public static handleComponentElement(
        virtualRender: VirtualRender,
        parent: HTMLElement,
        tag: (...args: unknown[]) => VirtualElement,
        props: Props,
        children: Array<string | VirtualElement>,
        key: string
    ): HTMLElement | HTMLElement[] {
        const existingComponentContainer = renderContextMemoryMap.get(key)
            ?.componentContainerRef as ComponentContainer;
        if (!existingComponentContainer) {
            Logger.logAction(
                'componentInit',
                `element ${tag.name}, key ${key}.`
            );
        }
        const componentContainer =
            existingComponentContainer ||
            new ComponentContainer(
                tag,
                props,
                children,
                key,
                parent,
                undefined,
                {},
                virtualRender
            );

        componentContainer.setProps(props).setChildren(children);

        Logger.logAction('render', `element ${tag.name}, key ${key}.`);
        const rendered = componentContainer.render() as HTMLElement[];
        if (rendered == null) {
            Logger.logAction('unmounted', `element ${tag.name}, key ${key}.`);
            RenderSignal.instance.deleteStoredContext(key);
        }
        return rendered;
    }

    public static handleNativeTagElement(tag: string, props: Props) {
        const element = document.createElement(tag);
        if (props) {
            const nonEmptyProps = props;
            const styleProp = <Record<string, unknown>>nonEmptyProps['style'];
            const refProp = <(e: HTMLElement) => void>nonEmptyProps['ref'];
            const propsEntries = Object.entries(nonEmptyProps).filter(
                ([propKey]) => !['style', 'ref'].includes(propKey)
            );
            const mutatedPropsEntries =
                RenderUtils.handleAttributeMutation(propsEntries);
            if (styleProp && typeof styleProp == 'object') {
                element.setAttribute(
                    'style',
                    RenderUtils.convertStyleObjectToInlineStyle(styleProp)
                );
            }
            if (refProp && typeof refProp == 'function') {
                refProp(element);
            }
            RenderUtils.appendDomProps(element, mutatedPropsEntries);
        }
        return element;
    }

    public static appendDomProps(
        element: HTMLElement,
        propsEntries: Array<[string, any]>
    ) {
        propsEntries.forEach(([name, value]) => {
            if (isCapitalEventName(name)) {
                const eventName = name
                    .toLowerCase()
                    .substring(2) as keyof HTMLElementEventMap;
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
                    parent.appendChild(
                        typeof nestedChild !== 'string'
                            ? nestedChild
                            : this.renderText(nestedChild)
                    );
                }
            });
        }
    }

    public static renderText(child?: string) {
        return document.createTextNode(child || '');
    }

    public static convertStyleObjectToInlineStyle(
        styleObject: Record<string, unknown>
    ): string {
        const validStyleEntries = Object.entries(styleObject).map(
            ([name, value]) => {
                const validStyleAttr = name.startsWith('--')
                    ? name
                    : isAllLowerCase(name)
                    ? name
                    : name.replace(/(?:^\w|[A-Z]|\b-\w)/g, (match, i) =>
                          i == 0
                              ? match.toLocaleLowerCase()
                              : match[0] == '-'
                              ? match.toLocaleLowerCase()
                              : '-' + match.toLocaleLowerCase()
                      );
                return [validStyleAttr, value];
            }
        );
        return validStyleEntries
            .map(([key, value]) => `${key}: ${value}`)
            .join(';');
    }

    public static handleAttributeMutation(propsEntries: [string, any][]) {
        const classnameIndex = propsEntries.findIndex(
            ([key, value]) => key.toLocaleLowerCase() === 'classname'
        );
        if (classnameIndex > -1) {
            propsEntries[classnameIndex] = [
                'class',
                propsEntries[classnameIndex][1],
            ];
        }
        return propsEntries;
    }

    // public static renderStyle(
    //   presentable: IPresentable,
    //   presentableName: string,
    //   props: Record<string, any>
    // ): HTMLStyleElement | undefined {
    //   let styleElement: HTMLStyleElement | undefined;
    //   if (presentable.buildStyle && typeof presentable.buildStyle == "function") {
    //     const componentStyle = presentable.buildStyle(props);
    //     if (typeof componentStyle === "string") {
    //       styleElement = document.createElement("style");
    //       styleElement.textContent = componentStyle;
    //     } else if (typeof componentStyle?.use === "function") {
    //       if (!globalStyleMap.has(presentableName)) {
    //         componentStyle.use({
    //           registerStyle: (s) => globalStyleMap.set(presentableName, s),
    //         });
    //       }
    //       styleElement = globalStyleMap.get(presentableName);
    //     }
    //   }
    //   return styleElement;
    // }
}

export function isElementType(type: symbol, elementType: VirtualElementType) {
    return isSymbolShallowEquals(type, Symbol(elementType));
}
