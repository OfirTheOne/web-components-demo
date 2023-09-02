import { RenderContextCommunicator } from '../render-context/render-context-communicator';
import { EffectHookSlot, HookType } from '../../../models/i-render-context';
import { OneOrMany } from '../../../types/utils';
import { Props, VirtualRender } from '../../../models';
import { VirtualFnComponent } from '../../../models/virtual-fn-component';
import { BaseComponentContainer } from '../../base-component-container';

export class ComponentContainer extends BaseComponentContainer {
  onDispose(): void {
    console.log('onDispose');
  }
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
    );
  }

  render(): OneOrMany<HTMLElement> | null {
    RenderContextCommunicator.instance.setContext(this.key, this);
    const virtualElement = this.fnComponent(this._props || {}, this._children);
    const isUnmounted = virtualElement == null;
    if (isUnmounted) {
      RenderContextCommunicator.instance.accessCurrentContext().hookSlotList.forEach((hookSlot) => {
        if (hookSlot.type === HookType.useEffect && (<EffectHookSlot>hookSlot).onUnmount) {
          (<EffectHookSlot>hookSlot).onUnmount();
        }
      });
      RenderContextCommunicator.instance.removeContext();
      return undefined;
    }

    if (RenderContextCommunicator.instance.accessCurrentContext().effectQueue.length > 0) {
      RenderContextCommunicator.instance.accessCurrentContext().effectTaskAgent.registerTask();
    }
    RenderContextCommunicator.instance.removeContext();
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
    RenderContextCommunicator.instance.deleteStoredContext(this.key);
  }
}
