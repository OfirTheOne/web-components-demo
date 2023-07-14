import { OneOrMany } from '../../../../types/utils';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { ShowProps } from './show.control';
import { VirtualElement } from '../../../../models/virtual-element';
import { Trackable } from '../../models';
import { BaseControlFlowComponentContainer } from '../../component-container/base-dynamic-template-component-container';
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
    currentConditionState: boolean | null = null;

    render(): OneOrMany<HTMLElement> | null {
        const domElement = this.resolveRenderedOutput();
        const currentContext = SignalRenderContextCommunicator.instance.accessContext(this.key);
        const showProps = this.props as ShowProps;
        const trackables: Trackable[] = Array.isArray(showProps.track) ? showProps.track : [showProps.track];


        trackables.forEach((trackable) => {
            const source = 'source' in trackable ? trackable.source : trackable;
            source.subscribe(() => {
                this._container = this.resolveRenderedOutput();
            });
        });
        this._container = domElement;
        return domElement;
    }

    resolveRenderedOutput(): OneOrMany<HTMLElement> | null {
        SignalRenderContextCommunicator.instance.setContext(this.key, this);

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
            domElement = this.coreRender(renderTarget);
            if (whenResult) {
                this.defaultElementMemo = domElement;
            } else if (!whenResult) {
                this.fallbackElementMemo = domElement;
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
        console.log('onDispose');
    }

    // removeAllSignalListeners() {}
}
