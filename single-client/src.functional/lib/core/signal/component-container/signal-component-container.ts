import { DOMUtils } from '../../utils/dom-utils';
import { VirtualRender } from '../../types';
import { IComponentContainer } from '../../../models/i-component-container';
import { OneOrMany } from '../../../types/utils';
import { Props } from '../../../models/props';
import { FnComponent } from '../../../models/fn-component';
import { SignalRenderContextCommunicator } from '../render-context/signal-render-context-communicator';

export class SignalComponentContainer implements IComponentContainer {
  protected _container: OneOrMany<HTMLElement>;
  constructor(
    protected fnComponent: FnComponent,
    protected _props: Props,
    protected _children: any[],
    protected key: string,
    protected _parent: HTMLElement | null,
    protected style: any,
    protected options: Record<string, any>,
    protected internalRender: VirtualRender
  ) {}

  setParent(parent: HTMLElement | null) {
    this._parent = parent;
    return this;
  }
  setProps(props: Props) {
    this._props = props;
    return this;
  }
  setChildren(children: any[]) {
    this._children = children;
    return this;
  }

  public get children() {
    return this._children;
  }
  public get props() {
    return this._props;
  }
  public get container() {
    return this._container;
  }
  public get wasRenderedBefore() {
    return this._container !== undefined;
  }

  render(): OneOrMany<HTMLElement> | null {
    
    SignalRenderContextCommunicator.instance.setContext(this.key, this);
    const virtualElement = this.fnComponent(this._props || {}, this._children);
    SignalRenderContextCommunicator.instance.removeContext();
    const isUnmounted = virtualElement == null;
    if (isUnmounted) {
     
      // SignalRenderContextCommunicator.instance.removeContext();
      return undefined;
    }

    const domElement = <HTMLElement>this.internalRender(this._parent, virtualElement, this.key);
    if (this._parent) {
      if (this.wasRenderedBefore) {
        this.connectOnSelfRerender(domElement);
      } else {
        this.connectOnMount(domElement);
      }
    }
    this._container = domElement;
    return domElement;
  }
  onUnmount() {
    SignaledContextCommunicator.instance.deleteStoredContext(this.key);
  }

  public connectOnMount(domElement: OneOrMany<HTMLElement>) {
    DOMUtils.appendToParent(this._parent, domElement);
  }
  public connectOnSelfRerender(domElement: OneOrMany<HTMLElement>) {
    const firstContainerNode = Array.isArray(this._container) ? this._container[0] : this._container;
    const renderStartPointNode = (
      DOMUtils.isOnlyChild(firstContainerNode) ? null : firstContainerNode.previousSibling
    ) as HTMLElement | null;
    DOMUtils.removeSelf(this._container);
    DOMUtils.insertChildAfterNode(this._parent, domElement, renderStartPointNode);
  }
}
