import { DOMUtils } from '../utils/dom-utils';
import { VirtualRender } from '../types';
import { RenderSignal } from '../render-signal/render-signal';
import { IComponentContainer } from '../../models/i-component-container';
import { EffectHookSlot, HookType } from '../../models/i-render-context';
import { VirtualElement } from '../../models/virtual-element';
import { OneOrMany } from '../../types/utils';

export class ComponentContainer implements IComponentContainer {
  protected container: OneOrMany<HTMLElement>;
  constructor(
    protected fnComponent: (props: Record<string, unknown>, children: any[]) => VirtualElement,
    protected props: Record<string, any>,
    protected children: any[],
    protected key: string,
    protected parent: any,
    protected style: any,
    protected options: Record<string, any>,
    protected internalRender: VirtualRender
  ) {}

  setProps(props: Record<string, any>) {
    this.props = props;
    return this;
  }
  setChildren(children: any[]) {
    this.children = children;
    return this;
  }
  public get wasRenderedBefore() {
    return this.container !== undefined;
  }

  render() {
    RenderSignal.instance.signalContext(this.key, this);
    const virtualElement = this.fnComponent(this.props || {}, this.children);
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
    const domElement = this.internalRender(this.parent, virtualElement, this.key);
    if (this.parent) {
      if (!this.wasRenderedBefore) {
        DOMUtils.appendToParent(this.parent, <HTMLElement>domElement);
        this.container = <HTMLElement>domElement;
      } else {
        const firstContainerNode = Array.isArray(this.container) ? this.container[0] : this.container;
        const renderStartPointNode = (
          DOMUtils.isOnlyChild(firstContainerNode) ? null : firstContainerNode.previousSibling
        ) as HTMLElement | null;
        DOMUtils.removeSelf(this.container);
        DOMUtils.insertChildAfterNode(this.parent, domElement, renderStartPointNode);
        this.container = <HTMLElement>domElement;
      }
    }
    return domElement;
  }


  onUnmount() {
    RenderSignal.instance.deleteStoredContext(this.key);
  }
}
