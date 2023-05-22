
import { OneOrMany } from '../../../types/utils';
import { Props, VirtualRender } from '../../../models';
import { VirtualFnComponent } from '../../../models/virtual-fn-component';
import { SignalRenderContextCommunicator } from '../render-context/signal-render-context-communicator';
import { BaseComponentContainer } from '../../base-component-container';


export abstract class BaseControlFlowComponentContainer extends BaseComponentContainer {
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
      internalRender
    )
  }

  onUnmount() {
    SignalRenderContextCommunicator.instance.deleteStoredContext(this.key);
  }
}