import { Logger } from '@/common/logger';
import { ComponentKeyBuilder } from '@/common/component-key-builder';
import { DOMUtils } from '@/core/utils/dom-utils';
import { defineComponent } from '@/core/utils/define-component';
import { createElementPlaceholder } from '@/core/utils/create-element-placeholder';
import { OneOrMany } from '@/types';
import { VirtualElement } from '@/models/virtual-element';

import { BaseControlFlowComponentContainer } from '../../../component-container/base-dynamic-template-component-container';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { ForProps } from './for.control';
import { Trackable } from '../../signal';

const TAG_NAME = 'for-control'
defineComponent(
    TAG_NAME,
    class extends HTMLElement {});

export class ForControlFlowComponentContainer extends BaseControlFlowComponentContainer {
    onDispose(): void {
        console.log('onDispose');
    }
    listeners: Array<(value?: unknown) => void> = [];
    itemsElementMemoMap: Map<unknown, HTMLElement> = new Map();
    readonly placeholder = createElementPlaceholder(TAG_NAME, this.key);
    // fallbackElementMemo: OneOrMany<HTMLElement> = null;
    // defaultElementMemo: OneOrMany<HTMLElement> = null;

    render(): OneOrMany<HTMLElement> | null {
        const domElement = this.resolveRenderedOutput();
        const forProps = this.props as unknown as ForProps;
        const trackable: Trackable<unknown[]> = forProps.each;
        const source = 'source' in trackable ? trackable.source : trackable;
        const listener = () => {
            const preRenderComponentKeys = Array.from(this.itemsElementMemoMap.keys());
            this._container = this.resolveRenderedOutput();
            const postRenderComponentKeys = Array.from(this.itemsElementMemoMap.keys());
            const unmountedElementKeys = preRenderComponentKeys.filter(key => !postRenderComponentKeys.includes(key))
            if(!unmountedElementKeys.length) return;
            unmountedElementKeys.forEach(containerKay => {
                setTimeout(() => {
                    const contextsToUnmount = SignalRenderContextCommunicator.instance
                        .getAllChildContexts(<string>containerKay);
                    contextsToUnmount
                        .forEach((ctx) => {
                            try {
                                Logger.log('unmounting', ctx.componentKey);
                                ctx.onUnmount();
                            } catch (error) {
                                Logger.error(`[ForControlFlowComponentContainer:onUnmount]`,error);
                            }
                        }   
                    );
                }, 0);
            })
        };
        this.listeners.push(listener);
        source.subscribe(listener);
        this._container = domElement;
        return domElement;  
    }

    resolveRenderedOutput(): OneOrMany<HTMLElement> | null {
        SignalRenderContextCommunicator.instance.setContext(this.key, this);
        const forProps = this.props as unknown as ForProps;
        const trackable = forProps.each;
        const indexResolver = this.createItemResolver(forProps);
        const virtualItemViewFactory = (Array.isArray(this._children) ? this._children[0] : this._children) as unknown as (
            ...args: unknown[]
        ) => VirtualElement;
        let domElement: OneOrMany<HTMLElement>;
        if(trackable.value === undefined || trackable.value === null || trackable.value.length === 0) {
            domElement = this.placeholder;
        } else {
            const currentRenderedElementMap = new Set<unknown>();
            domElement = trackable.value.map((item, index) => {
                const memoIndex = String(indexResolver(item, index));
                const usedKey = ComponentKeyBuilder.build(this.key).idx(memoIndex).toString();
                currentRenderedElementMap.add(usedKey);
                if (this.itemsElementMemoMap.has(usedKey)) {
                    return this.itemsElementMemoMap.get(usedKey);
                }
                const virtualItemView = virtualItemViewFactory(item, index);
                const itemDomElement = <HTMLElement>this.coreRender(virtualItemView, usedKey);
                this.itemsElementMemoMap.set(usedKey, itemDomElement);
                return itemDomElement;
            });
            Array.from(this.itemsElementMemoMap.keys()).forEach((key) => {
                if(!currentRenderedElementMap.has(key)) {
                    this.itemsElementMemoMap.delete(key);
                }
            });
        } 

        SignalRenderContextCommunicator.instance.removeContext();
        if (this._parent) {
            if (this.wasRenderedBefore) {
                if(this._container !== this.placeholder) {
                    this.parent.children.length > 0 ?
                        this.parent.insertBefore(this.placeholder, 
                            Array.isArray(this._container) ? 
                                this._container.at(0) : this._container) :
                        this.parent.append(this.placeholder);
                    DOMUtils.removeSelf(this._container);
                    DOMUtils.replace(this._parent, this.placeholder, domElement);
                } else {
                    this.connectOnSelfRerender(domElement);
                }
            } else {
                this.connectOnMount(domElement);
            }
        }
        return domElement;
    }

    createItemResolver(forProps: ForProps): ((item: unknown, index: number) => unknown) {
        const { index: forPropsIndex} = forProps
        if(forPropsIndex) {
            if(typeof forPropsIndex === 'function') {
                return forPropsIndex;
            } else if(typeof forPropsIndex === 'string') {
                return ((item) => item[forPropsIndex])
            }
        }
        return ((_item, index: number) => index);
    }
}
