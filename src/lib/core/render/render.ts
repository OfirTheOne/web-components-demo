import { ComponentKeyBuilder as ComponentKey } from '../component-key-builder';
import { memoComponentRenderer } from './renderer-handlers/memo-component.renderer';
import { primitiveElementRenderer } from './renderer-handlers/primitive-element.renderer';
import { childrenElementRenderer } from './renderer-handlers/children-element.renderer';
import { fnComponentRenderer } from './renderer-handlers/fn-component.renderer';
import { signalComponentRenderer } from './renderer-handlers/signal-component.renderer';
import { RenderUtils } from '../utils/render-utils';
import { VirtualElement, DomCompatibleElement, VirtualElementType, VirtualRender } from '../../models';
import { signalRender } from './signal-render';

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
  if (!vElem) {
    return null
  }
  const { tag, props, children, $$type } = vElem;

  switch ($$type) {
    case Symbol.for(VirtualElementType.Fragment): {
      if (typeof tag !== 'function') {
        throw new Error('Render parser error');
      }
      element = childrenElementRenderer(internalRender, parent, children, ComponentKey.build(key).fragment().toString());
    }
      break;
    case Symbol.for(VirtualElementType.SignaledFunction): {
      if (typeof tag !== 'function') {
        throw new Error('Render parser error');
      }
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
      break;
    case Symbol.for(VirtualElementType.MemoFunction): {
      if (typeof tag !== 'function') {
        throw new Error('Render parser error');
      }
      const tagName = tag['__name__'];
      element = memoComponentRenderer(
        internalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(`${tag.name}:${tagName}`).toString()
      );
    }
      break;
    case Symbol.for(VirtualElementType.Function): {
      if (typeof tag !== 'function') {
        throw new Error('Render parser error');
      }
      element = fnComponentRenderer(
        internalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(tag.name).toString()
      );
    }
      break;
    case Symbol.for(VirtualElementType.Basic): {
      if (typeof tag === 'function') {
        throw new Error('Render parser error');
      }
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
      break;
    default:
      throw new Error('Render parser error');
  }
  return element;
};

