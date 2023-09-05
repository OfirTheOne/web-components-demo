import { Logger } from "@/common/logger";
import { VirtualElement, VirtualRender, Props } from "@/models";
import { EqualFn } from "@/models/equal-fn";
import { VirtualFnComponent } from "@/models/virtual-fn-component";

import { ComponentContainer } from "@/core/state-core/component-container/component-container";
import { renderContextMemoryMap } from "@/core/global-storage";
import { fnComponentRenderer } from "./fn-component.renderer";

export function memoComponentRenderer(
    virtualRender: VirtualRender,
    parent: HTMLElement,
    tag: VirtualFnComponent,
    props: Props,
    children: Array<string | VirtualElement>,
    key: string
  ) {
    const existingComponentContainer = renderContextMemoryMap.get(key)?.componentContainerRef as ComponentContainer;
    const isMounted = existingComponentContainer && existingComponentContainer.wasRenderedBefore; 
    let shouldRenderMemo = false;
    if(isMounted) {
      const areEqual = tag['_areEqual_'] as EqualFn;
      if(!areEqual || typeof areEqual !== 'function' ) {
        throw new Error('Memo function must have an _areEqual_ function');
      }
      const arePropsEqual = areEqual(existingComponentContainer.props, props);
      // const areChildrenEqual = areEqual(existingComponentContainer.children, children);
      if(arePropsEqual) {
        shouldRenderMemo = true;
      } 
    }
    if(shouldRenderMemo) {
      Logger.logAction('memoRender', `element ${tag.name}, key ${key}.`);
      existingComponentContainer.setParent(parent);
      existingComponentContainer.connectOnMount(existingComponentContainer.container)
      return existingComponentContainer.container;
    } else {
      return fnComponentRenderer(virtualRender, parent, tag, props, children, key);
    }
  }