import { OneOrMany } from '../../../../types/utils';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { CaseProps, SwitchProps } from './switch.control';
import { VirtualElement } from '../../../../models/virtual-element';
import { ControlFlow, Trackable } from '../../models';
import { BaseControlFlowComponentContainer } from '../../component-container/base-dynamic-template-component-container';

export class SwitchControlFlowComponentContainer extends BaseControlFlowComponentContainer {
    listeners: Array<(value?: unknown) => void> = [];
    caseElementMemoMap: Map<number, OneOrMany<HTMLElement>> = new Map();
    fallbackElementMemo: OneOrMany<HTMLElement> = null;

    render(): OneOrMany<HTMLElement> | null {
        const domElement = this.resolveRenderedOutput();
        const switchProps = this.props as unknown as SwitchProps;
        const trackables: Trackable[] = switchProps.track;
        trackables.forEach((trackable) => {
            const emitter = 'emitter' in trackable ? trackable.emitter : trackable.source.emitter;
            const listener = () => {
                this._container = this.resolveRenderedOutput();
            };
            this.listeners.push(listener);
            emitter.on('change', listener);
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

        let domElement: OneOrMany<HTMLElement> = null;
        if (virtualCaseIndex === -1) {
            if (this.fallbackElementMemo) {
                domElement = this.fallbackElementMemo;
            } else if (switchProps.fallback) {
                domElement = <HTMLElement>(
                    this.internalRender(this._parent, switchProps.fallback as unknown as VirtualElement, this.key)
                );
                this.fallbackElementMemo = domElement;
            }
        } else {
            if (this.caseElementMemoMap.has(virtualCaseIndex)) {
                domElement = this.caseElementMemoMap.get(virtualCaseIndex);
            } else {
                const virtualCase = virtualCaseChildren[virtualCaseIndex];
                domElement = <HTMLElement>this.internalRender(this._parent, virtualCase, this.key);
                this.caseElementMemoMap.set(virtualCaseIndex, domElement);
            }
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

/*

<Switch 
    fallback={<p>{x} is between 5 and 10</p>}
    track={[x]}
>
  <Case when={xValue => xValue > 10}>
    <p>{x} is greater than 10</p>
  </Case>
  <Case when={xValue => 5 > xValue}>
    <p>{x} is less than 5</p>
  </Case>
</Switch>


  */
