import { Props, VirtualRender, VirtualFnComponent } from '@/models';
import { OneOrMany } from '@/types';
import { BaseControlFlowComponentContainer } from './base-dynamic-template-component-container';
import { CONTROL_FLOW_HANDLER_MAP } from '../signal-core/control-flow/handler-map';

export class NoneControlFlowComponentContainer extends BaseControlFlowComponentContainer {
  onDispose(): void {
    throw new Error('Method not implemented.');
  }
  render(): OneOrMany<HTMLElement> | null {
    throw new Error('Method not implemented.');
  }
  onUnmount(): void {
    throw new Error('Method not implemented.');
  }
}

export class ControlFlowComponentContainerFactory {
  static create(
    dynamicTemplateSymbol: symbol,
    fnComponent: VirtualFnComponent,
    props: Props,
    children: any[],
    key: string,
    parent: HTMLElement | null,
    style: any,
    options: Record<string, any>,
    internalRender: VirtualRender
  ) {
   const ControlFlowComponentContainer 
    = CONTROL_FLOW_HANDLER_MAP[dynamicTemplateSymbol] 
    || NoneControlFlowComponentContainer;
    
  return new ControlFlowComponentContainer(
    fnComponent, 
    props, 
    children, 
    key, 
    parent, 
    style, 
    options, 
    internalRender);
  }
} 

