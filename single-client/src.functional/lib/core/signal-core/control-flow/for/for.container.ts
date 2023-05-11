import { OneOrMany } from '../../../../types/utils';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { ForProps } from './for.control';
import { VirtualElement } from '../../../../models/virtual-element';
import { Trackable } from '../../models';
import { BaseControlFlowComponentContainer } from '../../component-container/base-dynamic-template-component-container';

export class ForControlFlowComponentContainer extends BaseControlFlowComponentContainer {
    
    
    listeners: Array<((value?: unknown) => void)> = [];
    fallbackElementMemo: OneOrMany<HTMLElement> = null;
    defaultElementMemo: OneOrMany<HTMLElement> = null;
    itemsElementMemoMap: Map<string | number, HTMLElement> = new Map();


    render(): OneOrMany<HTMLElement> | null {
        const domElement = this.resolveRenderedOutput();
        const forProps = this.props as ForProps;

        const trackable: Trackable = forProps.each;

        const emitter = 'emitter' in trackable ? trackable.emitter : trackable.source.emitter;
        const listener = () => {
            this._container = this.resolveRenderedOutput();
        };
        this.listeners.push(listener);
        emitter.on('change', listener);
        this._container = domElement;
        return domElement;
    }

    resolveRenderedOutput(): OneOrMany<HTMLElement> | null {
        SignalRenderContextCommunicator.instance.setContext(this.key, this);

        const forProps = this.props as ForProps;
        const trackable = forProps.each;
        const indexKey = forProps.indexKey;
        const shouldUseIndex = forProps.index || (
            (indexKey === undefined || indexKey === null) && 
            (typeof indexKey !== 'string' || typeof indexKey !== 'number')
        );
        // const defaultVirtualView = this._children as unknown as VirtualElement[];
        const virtualItemViewFactory =  (
            Array.isArray(this._children) ? 
                this._children[0] : 
                this._children
        ) as unknown as ((...args: unknown[]) => VirtualElement);


       const domElement: HTMLElement[] = trackable.value.map((item, index) => {
            const memoIndex: string | number = (
                shouldUseIndex ? index : indexKey[indexKey]
            );
            if(this.itemsElementMemoMap.has(memoIndex)) {
                const memoizedElement = this.itemsElementMemoMap.get(memoIndex);
                return memoizedElement;
            }   

            const virtualItemView = virtualItemViewFactory(item, index);
            const itemDomElement = <HTMLElement>this.internalRender(this._parent, virtualItemView, this.key);
            this.itemsElementMemoMap.set(memoIndex, itemDomElement);
            return itemDomElement;
        });
    
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

