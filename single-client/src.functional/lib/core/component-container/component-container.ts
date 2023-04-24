import { DOMUtils } from '../utils/dom-utils';
import { VirtualRender } from '../types';
import { RenderSignal } from '../render-signal/render-signal';
import { IComponentContainer } from '../../models/i-component-container';
import { EffectHookSlot, HookType } from '../../models/i-render-context';
import { OneOrMany } from '../../types/utils';
import { Props } from '../../models/props';
import { FnComponent } from '../../models/fn-component';

export class ComponentContainer implements IComponentContainer {
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
    RenderSignal.instance.signalContext(this.key, this);
    const virtualElement = this.fnComponent(this._props || {}, this._children);
    const isUnmounted = virtualElement == null;
    if (isUnmounted) {
      RenderSignal.instance.accessCurrentContext().hookSlotList.forEach((hookSlot) => {
        if (hookSlot.type === HookType.useEffect && (<EffectHookSlot>hookSlot).onUnmount) {
          (<EffectHookSlot>hookSlot).onUnmount();
        }
      });
      RenderSignal.instance.removeContext();
      return undefined;
    }

    if (RenderSignal.instance.accessCurrentContext().effectQueue.length > 0) {
      RenderSignal.instance.accessCurrentContext().effectTaskAgent.registerTask();
    }
    RenderSignal.instance.removeContext();
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
    RenderSignal.instance.deleteStoredContext(this.key);
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
