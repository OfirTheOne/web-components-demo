import { OneOrMany } from '@/types/utils';
import { VirtualElement } from '@/models/virtual-element';
import { ComponentKeyBuilder } from '@/common/component-key-builder';
import { Logger } from '@/common/logger';
import { CaseProps, SwitchProps } from './switch.control';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { BaseControlFlowComponentContainer } from '../../../component-container/base-dynamic-template-component-container';
import { defineComponent } from '../../../utils/define-component';
import { createElementPlaceholder } from '../../../utils/create-element-placeholder';
import { ControlFlow, Trackable } from '../../models';

const TAG_NAME = 'switch-control'
defineComponent(
    TAG_NAME,
    class extends HTMLElement {});

export class SwitchControlFlowComponentContainer extends BaseControlFlowComponentContainer {
    listeners: Array<(value?: unknown) => void> = [];
    readonly containersMap = new WeakMap<OneOrMany<HTMLElement>, string>();
    
    caseElementMemoMap: Map<number, OneOrMany<HTMLElement>> = new Map();
    fallbackElementMemo: OneOrMany<HTMLElement> = null;
    currentConditionState: number | null = null;
    readonly placeholder = createElementPlaceholder(TAG_NAME, this.key);

    render(): OneOrMany<HTMLElement> | null {
        const domElement = this.resolveRenderedOutput();
        const switchProps = this.props as unknown as SwitchProps;
        const trackables: Trackable[] = switchProps.track;
        trackables.forEach((trackable) => {
            const source = 'source' in trackable ? trackable.source : trackable;
            const listener = () => {
                const preRenderContainerKay = this.containersMap.get(this._container);
                this._container = this.resolveRenderedOutput();
                const postRenderContainerKay = this.containersMap.get(this._container);
                const isContainerChanged = postRenderContainerKay !== preRenderContainerKay;
                if(isContainerChanged) {
                    setTimeout(() => {
                        SignalRenderContextCommunicator.instance.getAllChildContexts(preRenderContainerKay)
                            .forEach((ctx) => {
                                try {
                                    ctx.onUnmount();
                                } catch (error) {
                                    Logger.error(`[SwitchControlFlowComponentContainer:getAllChildContexts:onUnmount]`,error);
                                }
                            }   
                        );
                    }, 0);
                }
            };
            this.listeners.push(listener);
            source.subscribe(listener);
        });
        this._container = domElement;
        return domElement;
    }

    resolveRenderedOutput(): OneOrMany<HTMLElement> | null {
        SignalRenderContextCommunicator.instance.setContext(this.key, this);
        const switchProps = this.props as unknown as SwitchProps;
        const trackables: Trackable[] = switchProps.track;
        const trackablesValueSnapshot = trackables.map((t) => t.value);
        const virtualChildren = this._children as unknown as VirtualElement[];
        const virtualCaseChildren = virtualChildren.filter((v) => v.tag['$$control-flow'] === Symbol.for(ControlFlow.Case));
        const virtualCaseIndex = virtualCaseChildren.findIndex((caseV) => {
            const when = (caseV.props as unknown as CaseProps)?.when;
            if (typeof when == 'function') {
                return when(trackablesValueSnapshot);
            }
            return false;
        });

        if(this.currentConditionState !== null && this.currentConditionState === virtualCaseIndex) {
            return this._container; 
        } 

        this.currentConditionState = virtualCaseIndex;
        let domElement: OneOrMany<HTMLElement> = null;
        if (virtualCaseIndex === -1) {
            if (this.fallbackElementMemo) {
                domElement = this.fallbackElementMemo;
            } else if (switchProps.fallback) {
                const usedKey = `${this.key}-fallback`;
                domElement =
                    this.coreRender(switchProps.fallback as unknown as VirtualElement, usedKey) as HTMLElement;
                this.fallbackElementMemo = domElement;
                this.containersMap.set(domElement, usedKey);
                
            }
        } else {
            if (this.caseElementMemoMap.has(virtualCaseIndex)) {
                domElement = this.caseElementMemoMap.get(virtualCaseIndex);
            } else {
                const virtualCase = virtualCaseChildren[virtualCaseIndex];
                const usedKey = ComponentKeyBuilder.build(this.key).idx(virtualCaseIndex).toString();
                domElement = this.coreRender(virtualCase, usedKey);
                this.containersMap.set(domElement, usedKey);
                this.caseElementMemoMap.set(virtualCaseIndex, domElement);
            }
        }

        if (!domElement || (Array.isArray(domElement) && domElement.length == 0)) {
            domElement = this.placeholder;
        }
        SignalRenderContextCommunicator.instance.removeContext();
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
        console.log('')
    }
}
