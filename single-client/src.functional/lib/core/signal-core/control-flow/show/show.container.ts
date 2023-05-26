import { OneOrMany } from '../../../../types/utils';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { ShowPropsWithTrack, ShowPropsWithoutTrack } from './show.control';
import { VirtualElement } from '../../../../models/virtual-element';
import { Trackable } from '../../models';
import { BaseControlFlowComponentContainer } from '../../component-container/base-dynamic-template-component-container';
import { ComponentKeyBuilder } from '../../../component-key-builder';
import { defineComponent } from '../../../utils/define-component';

const TAG_NAME = 'show-control'
defineComponent(
    TAG_NAME,
    class extends HTMLElement {},
);

const createPlaceholder = (key: string) => {
    const ph = document.createElement(TAG_NAME);
    ph.setAttribute('role', 'ph');
    ph.setAttribute('for', key);
    ph.style.display = 'none';
    return ph;
}


export class ShowControlFlowComponentContainer extends BaseControlFlowComponentContainer {
    fallbackElementMemo: OneOrMany<HTMLElement> = null;
    defaultElementMemo: OneOrMany<HTMLElement> = null;
    readonly placeholder = createPlaceholder(this.key);
    currentConditionState: boolean | null = null;

    render(): OneOrMany<HTMLElement> | null {
        const domElement = this.resolveRenderedOutput();

        const showProps = this.props as ShowPropsWithoutTrack | ShowPropsWithTrack;
        let trackables: Trackable[];
        if (typeof showProps.when !== 'function') {
            const showWithoutTrackProps = this.props as ShowPropsWithoutTrack;
            const { when } = showWithoutTrackProps;
            trackables = [when];
        } else {
            const showWithTrackProps = this.props as ShowPropsWithTrack;
            const { track } = showWithTrackProps;
            trackables = track;
        }

        
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

        const showProps = this.props as ShowPropsWithoutTrack | ShowPropsWithTrack;
        const defaultVirtualView = this._children as unknown as VirtualElement[];
        const fallbackVirtualView = (showProps.fallback || null) as unknown as VirtualElement;
        let whenResult: boolean;

        if (typeof showProps.when !== 'function') {
            const showWithoutTrackProps = this.props as ShowPropsWithoutTrack;
            const { when } = showWithoutTrackProps;
            whenResult = !!when.value;
        } else {
            const showWithTrackProps = this.props as ShowPropsWithTrack;
            const { when, track } = showWithTrackProps;
            const values = track.map((signal) => signal.value);
            whenResult = !!when(values);
        }

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
            domElement = <HTMLElement>(
                (Array.isArray(renderTarget)
                    ? renderTarget.map((v, i) => this.internalRender(
                        this._parent, v,
                        ComponentKeyBuilder.build(this.key).idx(i).toString()
                    ))
                    : this.internalRender(this._parent, renderTarget, this.key))
            );
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
}
