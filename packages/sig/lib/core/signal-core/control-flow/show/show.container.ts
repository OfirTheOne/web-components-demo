import { Logger } from '@/common/logger';
import { OneOrMany } from '@/types/one-or-many';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { ShowProps } from './show.control';
import { VirtualElement } from '@/models/virtual-element';
import { Trackable } from '../../signal';

import { BaseControlFlowComponentContainer } from '../../../component-container/base-dynamic-template-component-container';
import { defineComponent } from '../../../utils/define-component';
import { createElementPlaceholder } from '../../../utils/create-element-placeholder';

const TAG_NAME = 'show-control'
defineComponent(
    TAG_NAME,
    class extends HTMLElement {},
);


export class ShowControlFlowComponentContainer extends BaseControlFlowComponentContainer {

    fallbackElementMemo: OneOrMany<HTMLElement> = null;
    defaultElementMemo: OneOrMany<HTMLElement> = null;
    readonly placeholder = createElementPlaceholder(TAG_NAME, this.key);
    readonly containersMap = new WeakMap<OneOrMany<HTMLElement>, string>();

    currentConditionState: boolean | null = null;

    render(): OneOrMany<HTMLElement> | null {
        const domElement = this.resolveRenderedOutput();
        const showProps = this.props as ShowProps;
        const trackables: Trackable[] = Array.isArray(showProps.track) ? showProps.track : [showProps.track];

        trackables.forEach((trackable) => {
            const source = 'source' in trackable ? trackable.source : trackable;
            source.subscribe(() => {
                const preRenderContainerKay = this.containersMap.get(this._container);
                this._container = this.resolveRenderedOutput();
                const postRenderContainerKay = this.containersMap.get(this._container);
                const isContainerChanged = postRenderContainerKay !== preRenderContainerKay;
                if(isContainerChanged) {
                    setTimeout(() => {
                        const contextsToUnmount = SignalRenderContextCommunicator.instance
                        .getAllChildContexts(preRenderContainerKay);
                        contextsToUnmount
                            .forEach((cntr) => {
                                try {
                                    console.log('unmounting', cntr.componentKey);
                                    cntr.onUnmount();
                                } catch (error) {
                                    Logger.error(`[ShowControlFlowComponentContainer:getComponentContainerToUnmount:onUnmount]`,error);
                                }
                            }   
                        );
                    }, 0);
                }

            });
        });
        this._container = domElement;
        return domElement;
    }

    resolveRenderedOutput(): OneOrMany<HTMLElement> | null {
        const showProps = this.props as ShowProps;
        const defaultVirtualView = this._children as unknown as VirtualElement[];
        const fallbackVirtualView = (showProps.fallback || null) as unknown as VirtualElement;
        const trackables: Trackable[] = Array.isArray(showProps.track) ? showProps.track : [showProps.track];
        const defaultWhenFn = (values: unknown[]) => values.every((value) => Boolean(value));
        const { when = defaultWhenFn } = showProps;
        const values = trackables.map((signal) => signal.value);
        const whenResult = Boolean(when(values));

        if (this.currentConditionState !== null && this.currentConditionState === whenResult) {
            return this._container;
        }
        this.currentConditionState = whenResult;
        let domElement: OneOrMany<HTMLElement> = null;
        const renderTarget = whenResult ? defaultVirtualView : fallbackVirtualView;
        if (!renderTarget) {
            domElement = this.placeholder;
        } else if (!whenResult && this.fallbackElementMemo) {
            domElement = this.fallbackElementMemo;
        } else if (whenResult && this.defaultElementMemo) {
            domElement = this.defaultElementMemo;
        } else {

            const usedKey = whenResult ? `${this.key}:default` : `${this.key}:fallback`;
            SignalRenderContextCommunicator.instance.setContext(usedKey, this);
            domElement = this.coreRender(renderTarget, usedKey); 
            SignalRenderContextCommunicator.instance.removeContext();

            this.containersMap.set(domElement, usedKey);
            if (whenResult) {
                this.defaultElementMemo = domElement;
            } else if (!whenResult) {
                this.fallbackElementMemo = domElement;
            }
        }
 
        if (!domElement || (Array.isArray(domElement) && domElement.length == 0)) {
            domElement = this.placeholder;
        }
        if (this._parent) {
            if (this.wasRenderedBefore) {
                this.connectOnSelfRerender(domElement);
            } else {
                this.connectOnMount(domElement);
            }
        }
        return domElement;
    }

    onDispose(): void {
        console.log('onDispose');
    }

}
