import { VirtualRender } from '../../types';
import { Logger } from '../../../common/logger';
import { ComponentContainer } from '../../component-container/component-container';
import { Props, VirtualElement } from '../../../models';
import { OneOrMany } from '../../../types/utils';
import { FnComponent } from '../../../models/fn-component';
import { SignalComponentContainer } from '../../signal/component-container/signal-component-container';
import { SignalRenderContextCommunicator } from '../../signal/render-context/signal-render-context-communicator';
import { DynamicTemplateComponentContainer } from '../../signal/component-container/dynamic-template-component-container';
import { isDynamicTemplate } from '../../utils/validators/is-dynamic-template';

export function signalComponentRenderer(
    virtualRender: VirtualRender,
    parent: HTMLElement,
    tag: FnComponent,
    props: Props,
    children: Array<string | VirtualElement>,
    key: string
): OneOrMany<HTMLElement> {
    const existingComponentContainer = SignalRenderContextCommunicator.instance.accessContext(key)
        ?.componentContainerRef as ComponentContainer;
    const isMounted = existingComponentContainer && existingComponentContainer.wasRenderedBefore;

    if (isMounted) {
        Logger.logAction('memoRender', `element ${tag.name}, key ${key}.`);
        existingComponentContainer.setParent(parent);
        existingComponentContainer.connectOnMount(existingComponentContainer.container);
        return existingComponentContainer.container;
    } else {
        const componentContainer = (
            existingComponentContainer || (
            isDynamicTemplate(tag) ? 
              new DynamicTemplateComponentContainer(tag, props, children, key, parent, undefined, {}, virtualRender) :
              new SignalComponentContainer(tag, props, children, key, parent, undefined, {}, virtualRender)
            )
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
}

/*
<Show
  when={loggedIn()}
  fallback={<button onClick={toggle}>Log in</button>}
>
  <button onClick={toggle}>Log out</button>
</Show>

*/
