import { Presentable } from "../../presentable";
import { WCContainer } from "./wc-container/wc-container";
import { getDefineComponentArg } from "../../../decorators/accessors";
import { Props } from "../../../models/props";
import { defineComponent } from "../../../utils/define-component";
import { VirtualElement } from "../../../models/virtual-element";
import { PreserveElementStateMap, InternalRender } from "./types";

type DomElement =
  | null
  | undefined
  | string
  | HTMLElement
  | (string | HTMLElement)[];

type Ctor<T> = new (...args: any[]) => T;

type CapitalEventName = `on${Capitalize<keyof HTMLElementEventMap>}`;

export function render(vElem: VirtualElement, id: string) {
  const element = virtualRender(
    vElem.tag,
    vElem.props,
    vElem.children,
    new Map(),
    "$"
  );
  Array.isArray(element)
    ? element.forEach((node) => document.getElementById(id).appendChild(node))
    : document.getElementById(id).appendChild(element);
}

const internalRender: InternalRender = (
  vElem,
  parentPreservedStateMap: PreserveElementStateMap
): HTMLElement | HTMLElement[] => {
  return virtualRender(
    vElem.tag,
    vElem.props,
    vElem.children,
    parentPreservedStateMap,
    "$"
  );
};

const virtualRender = (
  tag: string | Function,
  props: Props = {},
  children: Array<string | VirtualElement>,
  parentPreservedStateMap: PreserveElementStateMap,
  key: string
): HTMLElement | HTMLElement[] => {
  let element: HTMLElement | HTMLElement[];
  if (typeof tag === "function" && isPresentable(tag)) {
    element = RenderUtils.handlePresentableElement(
      tag,
      props,
      children,
      parentPreservedStateMap,
      String(key + `.${tag.name}`)
    );
  } else if (typeof tag === "string") {
    const nativeElement = RenderUtils.handleNativeTagElement(tag, props);
    virtualRenderChildren(
      nativeElement,
      children,
      String(key + `.${tag}`),
      parentPreservedStateMap
    );
    element = nativeElement;
  }
  return element;
};

function virtualRenderChildren(
  parent: HTMLElement,
  children: (string | VirtualElement)[],
  key: string,
  parentPreservedStateMap: PreserveElementStateMap
) {
  if (children.length > 0) {
    children
      .map((child, i) => {
        if (child === undefined || child === null) {
          return child as null;
        } else {
          return typeof child === "string"
            ? child
            : virtualRender(
                child.tag,
                child.props,
                child.children,
                parentPreservedStateMap,
                String(key + `.${i}`)
              );
        }
      })
      .forEach((child) => RenderUtils.appendDomChildren(parent, child));
  }
}

function isCapitalEventName(evName: string): evName is CapitalEventName {
  return evName.startsWith("on") && evName.toLowerCase() in window;
}

function isPresentable(
  maybePresentable: Function
): maybePresentable is Ctor<Presentable> {
  return maybePresentable.prototype instanceof Presentable;
}

class RenderUtils {
  public static handlePresentableElement(
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

      const wcc = new WccCtor(
        options,
        new tag(),
        props,
        children,
        internalRender
      );

      if (!parentPreservedStateMap.has(key)) {
        parentPreservedStateMap.set(key, {
          state: {},
        });
      }
      const preservedState = parentPreservedStateMap.get(key)?.state || {};
      wcc.injectState(preservedState);
      return wcc.render();
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
      const styleProp = nonEmptyProps["style"];
      const propsEntries = Object.entries(nonEmptyProps).filter(
        ([propKey, _val]) => propKey !== "style"
      );
      const mutatedPropsEntries =
        RenderUtils.handleAttributeMutation(propsEntries);
      if (styleProp && typeof styleProp == "object") {
        element.setAttribute(
          "style",
          RenderUtils.convertStyleObjectToInlineStyle(
            <Record<string, unknown>>styleProp
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
              : document.createTextNode(nestedChild)
          );
        }
      });
    }
  }

  public static convertStyleObjectToInlineStyle(
    styleObject: Record<string, unknown>
  ): string {
    const validStyleEntries = Object.entries(styleObject).map(
      ([name, value]) => {
        const validStyleAttr = !name.includes("-")
          ? name
          : name.replace(/(?:^\w|[A-Z]|\b-\w)/g, (match, i) =>
              i == 0
                ? match.toLocaleLowerCase()
                : match[0] == "-"
                ? match.toLocaleUpperCase()
                : "-" + match.toLocaleUpperCase()
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
      if (propsEntries[classnameIndex][1].includes("TabContent tab2")) {
        console.log("herrerere");
      }
    }
    return propsEntries;
  }
}
