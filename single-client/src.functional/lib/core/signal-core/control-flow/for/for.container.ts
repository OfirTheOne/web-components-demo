import { OneOrMany } from '../../../../types/utils';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { ForProps } from './for.control';
import { VirtualElement } from '../../../../models/virtual-element';
import { Trackable } from '../../models';
import { BaseControlFlowComponentContainer } from '../../component-container/base-dynamic-template-component-container';
import { ComponentKeyBuilder } from '../../../component-key-builder';
import { defineComponent } from '../../../utils/define-component';


const TAG_NAME = 'for-control'
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

export class ForControlFlowComponentContainer extends BaseControlFlowComponentContainer {
    onDispose(): void {
        console.log('onDispose');
    }
    listeners: Array<(value?: unknown) => void> = [];
    fallbackElementMemo: OneOrMany<HTMLElement> = null;
    defaultElementMemo: OneOrMany<HTMLElement> = null;
    itemsElementMemoMap: Map<unknown, HTMLElement> = new Map();
    readonly placeholder = createPlaceholder(this.key);

    render(): OneOrMany<HTMLElement> | null {
        const domElement = this.resolveRenderedOutput();
        const forProps = this.props as ForProps;
        const trackable: Trackable = forProps.each;
        const source = 'source' in trackable ? trackable.source : trackable;
        const listener = () => {
            this._container = this.resolveRenderedOutput();
        };
        this.listeners.push(listener);
        source.subscribe(listener);
        this._container = domElement;
        return domElement;
    }

    resolveRenderedOutput(): OneOrMany<HTMLElement> | null {
        SignalRenderContextCommunicator.instance.setContext(this.key, this);
        const forProps = this.props as ForProps;
        const trackable = forProps.each;
        const indexKey = forProps.indexKey;
        const indexResolver: (item: unknown, index: number) => unknown = forProps.index
            ? typeof forProps.index === 'function'
                ? forProps.index
                : (_item, index: number) => index
            : typeof indexKey === 'string'
            ? (item) => item[indexKey]
            : (_item, index: number) => index;

        const virtualItemViewFactory = (Array.isArray(this._children) ? this._children[0] : this._children) as unknown as (
            ...args: unknown[]
        ) => VirtualElement;


        let domElement: OneOrMany<HTMLElement>;
        if(trackable.value === undefined || trackable.value === null || trackable.value.length === 0) {
            domElement = this.placeholder;
        } else {
            domElement = trackable.value.map((item, index) => {
                const memoIndex = indexResolver(item, index);
                if (this.itemsElementMemoMap.has(memoIndex)) {
                    return this.itemsElementMemoMap.get(memoIndex);
                }
    
                const virtualItemView = virtualItemViewFactory(item, index);
                const itemDomElement = <HTMLElement>this.coreRender( 
                    virtualItemView,
                    ComponentKeyBuilder.build(this.key).idx(index).toString());
                this.itemsElementMemoMap.set(memoIndex, itemDomElement);
                return itemDomElement;
            });
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
