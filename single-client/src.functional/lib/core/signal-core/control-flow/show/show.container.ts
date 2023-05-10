import { OneOrMany } from '../../../../types/utils';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { ShowPropsWithTrack, ShowPropsWithoutTrack } from './show.control';
import { VirtualElement } from '../../../../models/virtual-element';
import { Trackable } from '../../models';
import { BaseControlFlowComponentContainer } from '../../component-container/base-dynamic-template-component-container';

export class ShowControlFlowComponentContainer extends BaseControlFlowComponentContainer {
    fallbackElementMemo: OneOrMany<HTMLElement> = null;
    defaultElementMemo: OneOrMany<HTMLElement> = null;

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
            const emitter = 'emitter' in trackable ? trackable.emitter : trackable.source.emitter;
            emitter.on('change', () => {
                this._container = this.resolveRenderedOutput();
            });
        });
        this._container = domElement;
        return domElement;
    }

    resolveRenderedOutput(): OneOrMany<HTMLElement> | null {
        SignalRenderContextCommunicator.instance.setContext(this.key, this);

        // const virtualElement = this.fnComponent(this._props || {}, this._children);
        // const isUnmounted = virtualElement == null;
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
            whenResult = when(values);
        }

        let domElement: OneOrMany<HTMLElement> = null;

        if (!whenResult) {
            if (!fallbackVirtualView) {
                return null;
            }
            if (this.fallbackElementMemo) {
                domElement = this.fallbackElementMemo;
            } else {
                domElement = <HTMLElement>(
                    (Array.isArray(fallbackVirtualView)
                        ? fallbackVirtualView.map((v) => this.internalRender(this._parent, v, this.key))
                        : this.internalRender(this._parent, fallbackVirtualView, this.key))
                );
                this.fallbackElementMemo = domElement;
            }
        } else {
            if (!defaultVirtualView) {
                return null;
            }
            if (this.defaultElementMemo) {
                domElement = this.defaultElementMemo;
            } else {
                domElement = <HTMLElement>(
                    (Array.isArray(defaultVirtualView)
                        ? defaultVirtualView.map((v) => this.internalRender(this._parent, v, this.key))
                        : this.internalRender(this._parent, defaultVirtualView, this.key))
                );
                this.defaultElementMemo = domElement;
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
}
