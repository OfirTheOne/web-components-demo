// import { Presentable } from "../../presentable";
// import { WCContainer } from "./wc-container/wc-container";
// import { getDefineComponentArg } from "../../../decorators/accessors";
// import { defineComponent } from "../../../utils/define-component";
import { InternalRender } from "../types";
import { isCapitalEventName } from "./is-capital-event-name";
import { Props, VirtualElement } from "../../models";
import { DomCompatibleElement, DomElement } from "../../models/dom-element";
import { Logger } from "../../common/logger";
import { globalStyleMap } from "../global-storage";
import { ComponentContainer } from "../component-container/component-container";
import { isAllLowerCase } from "./common-utils";
import { RenderSignal } from "../render-signal/render-signal";

export class RenderUtils {
  public static handleComponentElement(
    internalRender: InternalRender,
    parent: HTMLElement,
    tag: Function,
    props: Props,
    children: Array<string | VirtualElement>,
    key: string
  ): HTMLElement | HTMLElement[] {
    Logger.logAction("componentInit", `element ${tag.name}, key ${key}.`);
    const componentContainer = new ComponentContainer(
      tag, 
      props, 
      children, 
      key, 
      parent,
      undefined, 
      {},
      internalRender
    );
    Logger.logAction("render", `element ${tag.name}, key ${key}.`);
    const rendered = componentContainer.render() as HTMLElement[];
    if (rendered == null) {
      Logger.logAction("unmounted", `element ${tag.name}, key ${key}.`);
      RenderSignal.deleteStoredContext(key);
    }
    return rendered;
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
          RenderUtils.convertStyleObjectToInlineStyle(styleProp)
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
    return document.createTextNode(child || "");
  }

  public static convertStyleObjectToInlineStyle(
    styleObject: Record<string, unknown>
  ): string {
    const validStyleEntries = Object.entries(styleObject).map(
      ([name, value]) => {
        const validStyleAttr = name.startsWith("--")
          ? name
          : isAllLowerCase(name)
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

  public static renderElement(
    parent: HTMLElement,
    componentFn: Function,
    props: Record<string, any> = {},
    children: any[],
    render: InternalRender
  ): DomCompatibleElement | DomCompatibleElement[] | undefined {
    const virtualElement = componentFn(
      props,
      children
    ) as unknown as VirtualElement;

    if (virtualElement == null) {
      return undefined;
    }
    const domElement = render(virtualElement, parent);
    return domElement;
  }
}
