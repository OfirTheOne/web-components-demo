import { Props, VirtualElement } from "../../../models";
import { PreserveElementStateMap, InternalRender } from "./types";
import { isPresentable } from "../../../utils/is-presentable";
import { RenderUtils } from "./render-utils";
import { FRAGMENT_FACTORY_NAME } from "../../../constants";
import { DomCompatibleElement } from "../../../models/dom-element";
import { ComponentKeyBuilder as ComponentKey } from "./component-key-builder";

export function render(elem: JSX.Element | VirtualElement, id: string) {
  const vElem = elem as VirtualElement;
  const element = virtualRender(
    null,
    vElem.tag,
    vElem.props,
    vElem.children,
    new Map(),
    ComponentKey.build().root().toString()
  );
  Array.isArray(element)
    ? element.forEach((node) => document.getElementById(id).appendChild(node))
    : document.getElementById(id).appendChild(element);
}

const internalRender: InternalRender = (
  vElem,
  parent,
  parentPreservedStateMap
): DomCompatibleElement | DomCompatibleElement[] => {
  return virtualRender(
    parent,
    vElem.tag,
    vElem.props,
    vElem.children,
    parentPreservedStateMap,
    ComponentKey.build().root().toString()
  );
};

const virtualRender = (
  parent: HTMLElement,
  tag: string | Function,
  props: Props = {},
  children: Array<string | VirtualElement>,
  parentPreservedStateMap: PreserveElementStateMap,
  key: string
): DomCompatibleElement | DomCompatibleElement[] => {
  let element: DomCompatibleElement | DomCompatibleElement[];
  if (typeof tag === "function" && isPresentable(tag)) {
    element = RenderUtils.handlePresentableElement(
      internalRender,
      parent,
      tag,
      props,
      children,
      parentPreservedStateMap,
      ComponentKey.build().root().tag(tag.name).toString()
    );
  } else if (typeof tag === "function" && tag.name === FRAGMENT_FACTORY_NAME) {
    element = virtualRenderChildren(
      parent,
      children,
      parentPreservedStateMap,
      ComponentKey.build(key).fragment().toString()
    ).flat();
  } else if (typeof tag === "string") {
    const nativeElement = RenderUtils.handleNativeTagElement(tag, props);
    const renderedChildren = virtualRenderChildren(
      nativeElement,
      children,
      parentPreservedStateMap,
      ComponentKey.build(key).tag(tag).toString()
    );
    renderedChildren.forEach((child) =>
      RenderUtils.appendDomChildren(nativeElement, child)
    );

    element = nativeElement;
  }
  return element;
};

function virtualRenderChildren(
  parent: HTMLElement,
  children: (string | VirtualElement)[],
  parentPreservedStateMap: PreserveElementStateMap,
  key: string
): DomCompatibleElement[] {
  if (children.length > 0) {
    return children
      .map((child, i) => {
        if (child === undefined || child === null) {
          return child as null;
        } else if (typeof child !== "string") {
          return virtualRender(
            parent,
            child.tag,
            child.props,
            child.children,
            parentPreservedStateMap,
            ComponentKey.build(key).idx(i).toString()
          );
        } else {
          return RenderUtils.renderText(child);
        }
      })
      .flat();
  } else {
    return [];
  }
}