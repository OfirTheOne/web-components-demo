
import { Props, VirtualRender, VirtualFnComponent } from '../../../models';
import { SignalRenderContextCommunicator } from '../render-context/signal-render-context-communicator';
import { BaseComponentContainer } from '../../base-component-container';


export abstract class BaseControlFlowComponentContainer extends BaseComponentContainer {

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