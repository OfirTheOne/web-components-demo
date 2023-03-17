import { Props, VirtualElement } from "../../../models";
import { PreserveElementStateMap, InternalRender } from "./types";
import { isPresentable } from "../../../utils/is-presentable";
import { ComponentKeyToken } from "./component-key-token";
import { RenderUtils } from "./render-utils";



export function render(elem: JSX.Element | VirtualElement, id: string) {
  const vElem = elem as VirtualElement;
  const element = virtualRender(
    vElem.tag,
    vElem.props,
    vElem.children,
    new Map(),
    ComponentKeyToken.ROOT
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
    ComponentKeyToken.ROOT
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
      internalRender,
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
      String(key + ComponentKeyToken.SEPARATOR + `${tag}`),
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
        } else if (typeof child !== "string") {
          return virtualRender(
            child.tag,
            child.props,
            child.children,
            parentPreservedStateMap,
            String(key + ComponentKeyToken.SEPARATOR + `${i}`)
          );
        } else {
          return child;
        }
      })
      .forEach((child) => RenderUtils.appendDomChildren(parent, child));
  }
}

