import { VirtualRender } from '../../types';
import { OneOrMany } from '../../../types/utils';
import { Props } from '../../../models/props';
import { VirtualFnComponent } from '../../../models/virtual-fn-component';
import { BaseDynamicTemplateComponentContainer } from './base-dynamic-template-component-container';
import { DYNAMIC_TEMPLATE_HANDLER_MAP } from '../dynamic-template/handler-map';

export class NoneDynamicTemplateComponentContainer extends BaseDynamicTemplateComponentContainer {
  render(): OneOrMany<HTMLElement> | null {
    throw new Error('Method not implemented.');
  }
}

export class DynamicTemplateComponentContainerFactory {
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
   const DynamicTemplateComponentContainer 
    = DYNAMIC_TEMPLATE_HANDLER_MAP[dynamicTemplateSymbol] 
    || NoneDynamicTemplateComponentContainer;
    
  return new DynamicTemplateComponentContainer(
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

