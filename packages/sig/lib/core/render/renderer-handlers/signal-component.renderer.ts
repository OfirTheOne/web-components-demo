import { Logger } from '@/common/logger';
import { Props, VirtualElement, VirtualRender, VirtualFnComponent } from '@/models';
import { OneOrMany } from '@/types';

import { SignalComponentContainer } from '@/core/component-container/signal-component-container';
import { ControlFlowComponentContainerFactory } from '@/core/component-container/dynamic-template-component-container';
import { SignalRenderContextCommunicator } from '@/core/signal-core/render-context/signal-render-context-communicator';
import { isControlFlow } from '@/core/utils/validators/is-dynamic-template';

export function signalComponentRenderer(
    virtualRender: VirtualRender,
    parent: HTMLElement,
    tag: VirtualFnComponent,
    props: Props,
    children: Array<string | VirtualElement>,
    key: string
): OneOrMany<HTMLElement> {
    const existingComponentContainer = SignalRenderContextCommunicator.instance.accessContext(key)
        ?.componentContainerRef as SignalComponentContainer;
    const isMounted = existingComponentContainer && existingComponentContainer.wasRenderedBefore;

    if (isMounted) {
        Logger.logAction('memoRender', `element ${tag.name}, key ${key}.`);
        existingComponentContainer.setParent(parent);
        existingComponentContainer.connectOnMount(existingComponentContainer.container);
        return existingComponentContainer.container;
    } else {
        const componentContainer = (
            existingComponentContainer || (
            isControlFlow(tag) ? 
            ControlFlowComponentContainerFactory.create(
                tag['$$control-flow'], tag, props, children, key, parent, undefined, {}, virtualRender) :
              new SignalComponentContainer(tag, props, children, key, parent, undefined, {}, virtualRender)
            )
        )
            .setProps(props)
            .setChildren(children);
        Logger.logAction('signalRender', `element ${tag.name}, key ${key}.`);
        const rendered = componentContainer.render();
        if (rendered == null) {
            Logger.logAction('unmounted', `element ${tag.name}, key ${key}.`);
        }
        return rendered;
    }
}

