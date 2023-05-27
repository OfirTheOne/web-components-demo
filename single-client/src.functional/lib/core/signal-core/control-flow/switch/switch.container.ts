import { OneOrMany } from '../../../../types/utils';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { CaseProps, SwitchProps } from './switch.control';
import { VirtualElement } from '../../../../models/virtual-element';
import { ControlFlow, Trackable } from '../../models';
import { BaseControlFlowComponentContainer } from '../../component-container/base-dynamic-template-component-container';
import { defineComponent } from '../../../utils/define-component';
import { ComponentKeyBuilder } from '../../../component-key-builder';


const TAG_NAME = 'switch-control'
defineComponent(
    TAG_NAME,
    class extends HTMLElement {});

const createPlaceholder = (key: string) => {
   const ph = document.createElement(TAG_NAME);
   ph.setAttribute('role', 'ph');
   ph.setAttribute('for', key);
   ph.style.display = 'none';
   ph.style.visibility = 'hidden';
   return ph;
}


export class SwitchControlFlowComponentContainer extends BaseControlFlowComponentContainer {
    listeners: Array<(value?: unknown) => void> = [];
    
    caseElementMemoMap: Map<number, OneOrMany<HTMLElement>> = new Map();
    fallbackElementMemo: OneOrMany<HTMLElement> = null;
    readonly placeholder = createPlaceholder(this.key);

    currentConditionState: number | null = null;

    render(): OneOrMany<HTMLElement> | null {
        const domElement = this.resolveRenderedOutput();
        const switchProps = this.props as unknown as SwitchProps;
        const trackables: Trackable[] = switchProps.track;
        trackables.forEach((trackable) => {
            const source = 'source' in trackable ? trackable.source : trackable;
            const listener = () => {
                this._container = this.resolveRenderedOutput();
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
            const when = (caseV.props as CaseProps).when;
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
                domElement = <HTMLElement>(
                    this.coreRender(switchProps.fallback as unknown as VirtualElement)
                );
                this.fallbackElementMemo = domElement;
            }
        } else {
            if (this.caseElementMemoMap.has(virtualCaseIndex)) {
                domElement = this.caseElementMemoMap.get(virtualCaseIndex);
            } else {
                const virtualCase = virtualCaseChildren[virtualCaseIndex];
                domElement = <HTMLElement>this.internalRender(this._parent, virtualCase, 
                    ComponentKeyBuilder.build(this.key).idx(virtualCaseIndex).toString()
                );
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
}
