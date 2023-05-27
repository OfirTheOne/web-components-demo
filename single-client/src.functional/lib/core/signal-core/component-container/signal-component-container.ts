import { OneOrMany } from '../../../types/utils';
import { Props, VirtualElement, VirtualRender } from '../../../models';
import { VirtualFnComponent } from '../../../models/virtual-fn-component';
import { SignalRenderContextCommunicator } from '../render-context/signal-render-context-communicator';
import { BaseComponentContainer } from '../../base-component-container';
import { ComponentKeyBuilder } from '../../component-key-builder';

export class SignalComponentContainer extends BaseComponentContainer {
  protected _container: OneOrMany<HTMLElement>;
  constructor(
    fnComponent: VirtualFnComponent,
    props: Props,
    children: any[],
    key: string,
    parent: HTMLElement | null,
    style: any,
    options: Record<string, any>,
    internalRender: VirtualRender
  ) {
    super(
      fnComponent,
      props,
      children,
      key,
      parent,
      style,
      options,
      internalRender,
    )
  }

  render(): OneOrMany<HTMLElement> | null {
    SignalRenderContextCommunicator.instance.setContext(this.key, this);
    const virtualElement: OneOrMany<VirtualElement> = this.fnComponent(this._props || {}, this._children);
    const isUnmounted = virtualElement == null;
    if (isUnmounted) {
      this.onUnmount()
      return undefined;
    }
    const domElement = <HTMLElement>this.coreRender(virtualElement);
    SignalRenderContextCommunicator.instance.removeContext();
    if (this._parent) {
      if (this.wasRenderedBefore) {
        this.connectOnSelfRerender(domElement);
      } else {
        this.connectOnMount(domElement);
      }
    }
    this._container = domElement;
    this.onMount()
    if(domElement) {
      if(Array.isArray(domElement)) {
        domElement.forEach((e, i )=> e.setAttribute('key', 
          ComponentKeyBuilder.build(this._key).idx(i).toString()
        ));
      } else {
        domElement.setAttribute('key', this._key);
      }
    }
    return domElement;
  }
  onUnmount() {
    SignalRenderContextCommunicator.instance.accessContext(this.key)?.onUnmount();
    SignalRenderContextCommunicator.instance.deleteStoredContext(this.key);
  }
  onMount() {
    SignalRenderContextCommunicator.instance.accessContext(this.key)?.onMount();
  }
}
