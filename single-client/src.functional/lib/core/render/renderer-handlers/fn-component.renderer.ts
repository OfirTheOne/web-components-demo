import { VirtualRender } from '../../types';
import { Logger } from '../../../common/logger';
import { ComponentContainer } from '../../component-container/component-container';
import { renderContextMemoryMap } from '../../global-storage';
import { Props, VirtualElement } from '../../../models';
import { OneOrMany } from '../../../types/utils';
import { FnComponent } from '../../../models/fn-component';



export function fnComponentRenderer(
    virtualRender: VirtualRender,
    parent: HTMLElement,
    tag: FnComponent,
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