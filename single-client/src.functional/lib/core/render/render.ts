import { ComponentKeyBuilder as ComponentKey } from './../component-key-builder';
import { VirtualElement, DomCompatibleElement, VirtualElementType } from '../../models';
import { RenderUtils, isElementType } from './../utils/render-utils';
import { VirtualRender } from '../types';
import { memoComponentRenderer } from './renderer-handlers/memo-component.renderer';
import { primitiveElementRenderer } from './renderer-handlers/primitive-element.renderer';
import { childrenElementRenderer } from './renderer-handlers/childern-element.renderer';
import { fnComponentRenderer } from './renderer-handlers/fn-component.renderer';
import { signalComponentRenderer } from './renderer-handlers/signal-component.renderer';

export function render(elem: JSX.Element | VirtualElement, id: string) {
  const vElem = elem as VirtualElement;
  const element = virtualRender(null, vElem, ComponentKey.build().root().toString());
  Array.isArray(element)
    ? element.forEach((node) => document.getElementById(id).appendChild(node))
    : document.getElementById(id).appendChild(element);
}

const internalRender: VirtualRender = (vElem, parent, elemKey) => {
  return virtualRender(vElem, parent, elemKey || ComponentKey.build().root().toString());
};

const virtualRender: VirtualRender = (parent, vElem, key) => {
  let element: DomCompatibleElement | DomCompatibleElement[];
  const { tag, props, children, $$type } = vElem;
  if (typeof tag === 'function') {
    if (isElementType($$type, VirtualElementType.Fragment)) {
      element = childrenElementRenderer(internalRender, parent, children, ComponentKey.build(key).fragment().toString());
    } else if (isElementType($$type, VirtualElementType.SignaledFunction)) {
      const tagName = tag['__name__'];
      element = fnComponentRenderer(
        signalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(`${tag.name}:${tagName}`).toString()
      );
    } else if (isElementType($$type, VirtualElementType.MemoFunction)) {
      const tagName = tag['__name__'];
      element = memoComponentRenderer(
        internalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(`${tag.name}:${tagName}`).toString()
      );
    } else if (isElementType($$type, VirtualElementType.Function)) {
      element = fnComponentRenderer(
        internalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(tag.name).toString()
      );
    }
  } else if (isElementType($$type, VirtualElementType.Basic)) {
    const nativeElement = primitiveElementRenderer(tag, props);
    const renderedChildren = childrenElementRenderer(
      internalRender,
      nativeElement,
      children,
      ComponentKey.build(key).tag(tag).toString()
    );
    renderedChildren.forEach((child) => RenderUtils.appendDomChildren(nativeElement, child));
    element = nativeElement;
  }
  return element;
};

const signalRender: VirtualRender = (parent, vElem, key) => {
  let element: DomCompatibleElement | DomCompatibleElement[];
  const { tag, props, children, $$type } = vElem;
  if (typeof tag === 'function') {
    if (isElementType($$type, VirtualElementType.Fragment)) {
      element = childrenElementRenderer(signalRender, parent, children, ComponentKey.build(key).fragment().toString());
    } else if (isElementType($$type, VirtualElementType.SignaledFunction)) {
      const tagName = tag['__name__'];
      element = signalComponentRenderer(
        signalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(`${tag.name}:${tagName}`).toString()
      );
    }
  } else if (isElementType($$type, VirtualElementType.Basic)) {
    const nativeElement = primitiveElementRenderer(tag, props);
    const renderedChildren = childrenElementRenderer(
      signalRender,
      nativeElement,
      children,
      ComponentKey.build(key).tag(tag).toString()
    );
    renderedChildren.forEach((child) => RenderUtils.appendDomChildren(nativeElement, child));
    element = nativeElement;
  }
  return element;
};