import { ComponentKeyBuilder as ComponentKey } from '@/common/component-key-builder';
import { DomElement, VirtualElementType, VirtualRender } from '@/models';
import { OneOrMany } from '@/types';

import { RenderUtils } from '@/core/utils/render-utils';
import { primitiveElementRenderer } from './renderer-handlers/primitive-element.renderer';
import { childrenElementRenderer } from './renderer-handlers/children-element.renderer';
import { signalComponentRenderer } from './renderer-handlers/signal-component.renderer';


export const signalRender: VirtualRender = (parent, vElem, key) => {
  let element: OneOrMany<DomElement>;
  if (!vElem) {
    return null
  }
  if (typeof vElem === 'function') {
    // @TODO handle this case
    return null;
  }

  const { tag, props, children, $$type } = vElem;

  switch ($$type) {
    case Symbol.for(VirtualElementType.Fragment): {
      element = childrenElementRenderer(signalRender, parent, children, ComponentKey.build(key).fragment().toString());
    }
      break;
    case Symbol.for(VirtualElementType.SignaledFunction):
    case Symbol.for(VirtualElementType.Function): {
      if (typeof tag !== 'function') {
        throw new Error('Render parser error');
      }
      const tagName = tag['__name__'] ? `${tag.name}:${tag['__name__']}` : tag.name;
      element = signalComponentRenderer(
        signalRender,
        parent,
        tag,
        props,
        children,
        ComponentKey.build(key).tag(tagName).toString()
      );
    }
      break;
    case Symbol.for(VirtualElementType.Basic): {
      if (typeof tag === 'function') {
        throw new Error('Render parser error');
      }
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
      break;

    default:
      throw new Error('Render parser error');
  }
  return element;
};