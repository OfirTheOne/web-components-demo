import { Props } from './props';

export enum VirtualElementType {
  Function = 'Function',
  MemoFunction = 'MemoFunction',
  SignaledFunction = 'SignaledFunction',
  Fragment = 'Fragment',
  Basic = 'Basic',
  ModuleReference = 'ModuleReference',
  LazyReference = 'LazyReference',
  Unknown = 'Unknown',
}

export interface VirtualElement {
  $$type?: symbol;
  tag: string | ((...args: unknown[]) => VirtualElement);
  props: Props;
  children: Array<VirtualElement | string>;
}
