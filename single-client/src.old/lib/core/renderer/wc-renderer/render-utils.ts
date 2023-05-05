import { Presentable } from "../../presentable";
import { WCContainer } from "./wc-container/wc-container";
import { getDefineComponentArg } from "../../../decorators/accessors";
import { defineComponent } from "../../../utils/define-component";
import { Ctor, IPresentable, Props, VirtualElement } from "../../../models";
import { PreserveElementStateMap, InternalRender } from "./types";
import { isCapitalEventName } from "../../../utils/is-capital-event-name";
import { DomCompatibleElement, DomElement } from "../../../models/dom-element";
import { Logger } from "../../../services/logger";
import { globalStyleMap } from "./global-style-map";


export class RenderUtils {
  public static handlePresentableElement(
    internalRender: InternalRender,
    parent: HTMLElement,
    tag: Ctor<Presentable<any>>,
    props: Props,
    children: Array<string | VirtualElement>,
    parentPreservedStateMap: PreserveElementStateMap,
    key: string
  ): HTMLElement | HTMLElement[] {
    const args = getDefineComponentArg(tag);
    if (args) {
      const { name, options } = args;
      if (customElements.get(name) == undefined) {
        defineComponent(name, class extends WCContainer {}, options);
      }
      const WccCtor = customElements.get(name) as Ctor<WCContainer>;
      if (!parentPreservedStateMap.has(key)) {
        Logger.logAction('componentInit', `element ${tag.name}, key ${key}.`);
        const componentInstance = new tag();
        const initState = componentInstance.state;
        parentPreservedStateMap.set(key, {
          state: initState || {},
          componentInstance
        });
      }
      const preservedState = parentPreservedStateMap.get(key)?.state || {};
      const componentInstance = parentPreservedStateMap.get(key)?.componentInstance;

      const wcc = new WccCtor(
        options,
        componentInstance,
        parent,
        props,
        key,
        children,
        internalRender,
        { 
          presentableName: tag.name
        }
      );
      wcc.injectState(preservedState);
      Logger.logAction('render', `element ${tag.name}, key ${key}.`);
      const rendered = wcc.render();
      if(rendered == null) {
        Logger.logAction('unmounted', `element ${tag.name}, key ${key}.`);
        parentPreservedStateMap.delete(key);
      }
      return rendered;
    } else {
      throw new Error(
        "Presentable component must be decorated with @DefineComponent."
      );
    }
  }

  public static handleNativeTagElement(tag: string, props: Props) {
    const element = document.createElement(tag);
    if (props) {
      const nonEmptyProps = props;
      const styleProp = <Record<string, unknown>>nonEmptyProps["style"];
      const propsEntries = Object.entries(nonEmptyProps).filter(
        ([propKey, _val]) => propKey !== "style"
      );
      const mutatedPropsEntries =
        RenderUtils.handleAttributeMutation(propsEntries);
      if (styleProp && typeof styleProp == "object") {
        element.setAttribute(
          "style",
          RenderUtils.convertStyleObjectToInlineStyle(
            styleProp
          )
        );
      }
      mutatedPropsEntries.forEach(([name, value]) => {
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
    return element;
  }

  public static appendDomChildren(parent: HTMLElement, child: DomElement) {
    if (child) {
      const children = Array.isArray(child) ? child : [child];
      children.forEach((nestedChild) => {
        if (nestedChild) {
          parent.appendChild(
            typeof nestedChild !== "string"
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
        const validStyleAttr = 
          name.startsWith("--") ? 
          name : 
          isAllLowerCase(name)
          ? name
          : name.replace(/(?:^\w|[A-Z]|\b-\w)/g, (match, i) =>
              i == 0
                ? match.toLocaleLowerCase()
                : match[0] == "-"
                ? match.toLocaleLowerCase()
                : "-" + match.toLocaleLowerCase()
            );
        return [validStyleAttr, value];
      }
    );
    return validStyleEntries
      .map(([key, value]) => `${key}: ${value}`)
      .join(";");
  }

  public static handleAttributeMutation(propsEntries: [string, any][]) {
    const classnameIndex = propsEntries.findIndex(
      ([key, value]) => key.toLocaleLowerCase() === "classname"
    );
    if (classnameIndex > -1) {
      propsEntries[classnameIndex] = ["class", propsEntries[classnameIndex][1]];
    }
    return propsEntries;
  }

  public static  renderStyle(
    presentable: IPresentable,
    presentableName: string,
    props: Record<string, any>
  ): HTMLStyleElement | undefined {
    let styleElement: HTMLStyleElement | undefined;
    if (presentable.buildStyle && typeof presentable.buildStyle == "function") {
      const componentStyle = presentable.buildStyle(props);
      if (typeof componentStyle === "string") {
        styleElement = document.createElement("style");
        styleElement.textContent = componentStyle;
      } else if (typeof componentStyle?.use === "function") {
        if (!globalStyleMap.has(presentableName)) {
          componentStyle.use({
            registerStyle: (s) => globalStyleMap.set(presentableName, s),
          });
        }
        styleElement = globalStyleMap.get(presentableName);
      }
    }
    return styleElement;
  }
  
  public static renderElement(
    parent: HTMLElement,
    presentable: IPresentable,
    props: Record<string, any> = {},
    children: any[],
    preservedStateMap: PreserveElementStateMap,
    render: InternalRender
  ): DomCompatibleElement | DomCompatibleElement[] | undefined {
    const virtualElement = presentable.buildTemplate(
      props,
      children
    ) as unknown as VirtualElement;
  
    if (virtualElement == null) {
      return undefined;
    }
    const domElement = render(virtualElement, parent, preservedStateMap);
    return domElement;
  }
  
}



function isAllLowerCase(str: string) {
  return str === str.toLowerCase();
}