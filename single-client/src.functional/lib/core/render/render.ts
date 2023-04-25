import { ComponentKeyBuilder as ComponentKey } from './../component-key-builder';
import { VirtualElement, DomCompatibleElement, VirtualElementType } from '../../models';
import { RenderUtils, isElementType } from './../utils/render-utils';
import { VirtualRender } from '../types';
import { virtualRenderChildren } from './virtual-render-children';

export function render(elem: JSX.Element | VirtualElement, id: string) {
  const vElem = elem as VirtualElement;
  const element = virtualRender(null, vElem, ComponentKey.build().root().toString());
  Array.isArray(element)
    ? element.forEach((node) => document.getElementById(id).appendChild(node))
    : document.getElementById(id).appendChild(element);
}

const internalRender: VirtualRender = (vElem, parent, elemKey): DomCompatibleElement | DomCompatibleElement[] => {
  return virtualRender(vElem, parent, elemKey || ComponentKey.build().root().toString());
};

const virtualRender = (
  parent: HTMLElement,
  vElem: VirtualElement,
  key: string
): DomCompatibleElement | DomCompatibleElement[] => {
  let element: DomCompatibleElement | DomCompatibleElement[];
  const { tag, props, children, $$type } = vElem;
  if (typeof tag === 'function') {
    if (isElementType($$type, VirtualElementType.Fragment)) {
      element = virtualRenderChildren(virtualRender, parent, children, ComponentKey.build(key).fragment().toString()).flat();
    } else if (isElementType($$type, VirtualElementType.MemoFunction)) {
      const tagName = tag['__name__'];
      element = RenderUtils.handleMemoComponentElement(
        internalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(`${tag.name}:${tagName}`).toString()
      );
    } else if (isElementType($$type, VirtualElementType.Function)) {
      element = RenderUtils.handleComponentElement(
        internalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(tag.name).toString()
      );
    }
  } else if (isElementType($$type, VirtualElementType.Basic)) {
    const nativeElement = RenderUtils.handleNativeTagElement(tag, props);
    const renderedChildren = virtualRenderChildren(
      virtualRender,
      nativeElement,
      children,
      ComponentKey.build(key).tag(tag).toString()
    );
    renderedChildren.forEach((child) => RenderUtils.appendDomChildren(nativeElement, child));
    element = nativeElement;
  }
  return element;
};
