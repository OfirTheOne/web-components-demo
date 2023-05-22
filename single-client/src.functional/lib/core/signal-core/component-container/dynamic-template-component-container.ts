import { OneOrMany } from '../../../types/utils';
import { Props, VirtualRender } from '../../../models';
import { VirtualFnComponent } from '../../../models/virtual-fn-component';
import { BaseControlFlowComponentContainer } from './base-dynamic-template-component-container';
import { CONTROL_FLOW_HANDLER_MAP } from '../control-flow/handler-map';

export class NoneControlFlowComponentContainer extends BaseControlFlowComponentContainer {
  render(): OneOrMany<HTMLElement> | null {
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

