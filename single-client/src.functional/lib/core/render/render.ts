import { ComponentKeyBuilder as ComponentKey } from './../component-key-builder';
import { memoComponentRenderer } from './renderer-handlers/memo-component.renderer';
import { primitiveElementRenderer } from './renderer-handlers/primitive-element.renderer';
import { childrenElementRenderer } from './renderer-handlers/children-element.renderer';
import { fnComponentRenderer } from './renderer-handlers/fn-component.renderer';
import { signalComponentRenderer } from './renderer-handlers/signal-component.renderer';
import { RenderUtils } from './../utils/render-utils';
import { isElementOfType } from '../utils/validators/is-element-of-type';
import { VirtualElement, DomCompatibleElement, VirtualElementType } from '../../models';
import { VirtualRender } from '../types';

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
    if (isElementOfType($$type, VirtualElementType.Fragment)) {
      element = childrenElementRenderer(internalRender, parent, children, ComponentKey.build(key).fragment().toString());
    } else if (isElementOfType($$type, VirtualElementType.SignaledFunction)) {
      const tagName = tag['__name__'];
      element = signalComponentRenderer(
        signalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(`${tag.name}:${tagName}`).toString()
      );
    } else if (isElementOfType($$type, VirtualElementType.MemoFunction)) {
      const tagName = tag['__name__'];
      element = memoComponentRenderer(
        internalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(`${tag.name}:${tagName}`).toString()
      );
    } else if (isElementOfType($$type, VirtualElementType.Function)) {
      element = fnComponentRenderer(
        internalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(tag.name).toString()
      );
    }
  } else if (isElementOfType($$type, VirtualElementType.Basic)) {
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
    if (isElementOfType($$type, VirtualElementType.Fragment)) {
      element = childrenElementRenderer(signalRender, parent, children, ComponentKey.build(key).fragment().toString());
    } else if (isElementOfType($$type, VirtualElementType.SignaledFunction)) {
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
  } else if (isElementOfType($$type, VirtualElementType.Basic)) {
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