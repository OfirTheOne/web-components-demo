import { Logger } from '@/common/logger';
import { Props, VirtualElement, VirtualRender } from '@/models';
import { VirtualFnComponent } from '@/models/virtual-fn-component';
import { OneOrMany } from '@/types/utils';

import { ComponentContainer } from '@/core/state-core/component-container/component-container';
import { renderContextMemoryMap } from '@/core/global-storage';



export function fnComponentRenderer(
    virtualRender: VirtualRender,
    parent: HTMLElement,
    tag: VirtualFnComponent,
    props: Props,
    children: Array<string | VirtualElement>,
    key: string
  ): OneOrMany<HTMLElement> {
    const existingComponentContainer = renderContextMemoryMap.get(key)?.componentContainerRef as ComponentContainer;
    if (!existingComponentContainer) {
      Logger.logAction('componentInit', `element ${tag.name}, key ${key}.`);
    }
    const componentContainer = (
      existingComponentContainer || new ComponentContainer(tag, props, children, key, parent, undefined, {}, virtualRender)
    )
      .setProps(props)
      .setChildren(children);
    Logger.logAction('render', `element ${tag.name}, key ${key}.`);
    const rendered = componentContainer.render();
    if (rendered == null) {
      Logger.logAction('unmounted', `element ${tag.name}, key ${key}.`);
      componentContainer.onUnmount();
    }
    return rendered;
  }