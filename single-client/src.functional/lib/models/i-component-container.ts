import { VirtualRender } from "../core/types";
import { Props } from "./props";
import { VirtualFnComponent } from "./virtual-fn-component";

export interface IComponentContainer {
  component: VirtualFnComponent,
  props: Props,
  children: any[],
  key: string,
  parent: HTMLElement | null,
  
  internalRender: VirtualRender,
  render(): void;
  onUnmount(): void;
  
  // options: Record<string, any>,
  // style: any,
}
