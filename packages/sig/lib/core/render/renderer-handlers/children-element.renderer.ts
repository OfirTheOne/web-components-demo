import { ComponentKeyBuilder as ComponentKey } from '@/common/component-key-builder';
import { VirtualElement, DomCompatibleElement, VirtualRender } from '@/models';

import { RenderUtils } from '@/core/utils/render-utils';
import { isRenderTextPrimitive , isSignal, isDerivedSignal} from '@/core/utils/validators';
import { SignalRenderContextCommunicator } from '@/core/signal-core/render-context/signal-render-context-communicator';

export function childrenElementRenderer(
    virtualRender: VirtualRender,
    parent: HTMLElement,
    children: (string | VirtualElement)[],
    key: string
): DomCompatibleElement[] {
    if (children.length > 0) {
        return children
            .map((child) => {
                if (isSignal(child) || isDerivedSignal(child)) {
                    const signal = isSignal(child) ? child : child.source; 
                    const currentContext = SignalRenderContextCommunicator.instance.currentContext;
                    if (isRenderTextPrimitive(child.value)) {
                        const textNode = RenderUtils.renderText(child.value);
                        currentContext.subscribeSignal(child, {
                            componentKey: key,
                            containerElement: textNode,
                            connected: true,
                            signalId: signal.id,
                            type: null,
                            propKey: null,
                            id: child.id,
                        });
                        return textNode;
                    } else {
                        currentContext.subscribeSignal(child, {
                            componentKey: key,
                            containerElement: parent,
                            connected: true,
                            signalId: signal.id,
                            type: null,
                            propKey: null,
                            id: child.id,
                        });
                        return child.value as string | VirtualElement;
                    }
                } else {
                    return child;
                }
            })
            .map((child, i) => {
                if (child === undefined || child === null) {
                    return child as null;
                } else if (child instanceof Text) {
                    return child;
                } else if (isVirtualElement(child)) {
                    return virtualRender(parent, child, ComponentKey.build(key).idx(i).toString());
                } else {
                    return RenderUtils.renderText(child);
                }
            })
            .flat();
    } else {
        return [];
    }
}

function isVirtualElement(child: any): child is VirtualElement {
    return child !== null && typeof child === 'object' && 'tag' in child && 'props' in child && 'children' in child;
}
