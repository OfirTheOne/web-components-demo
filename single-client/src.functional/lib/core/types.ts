import { DomCompatibleElement } from '../models/dom-element';
import { VirtualElement } from '../models/virtual-element';

// export interface PreserveElementState<E extends HTMLElement = HTMLElement> {
//     state: Record<any, any>;
//     preserved?: E;
//     componentInstance: any
// }

// export type PreserveElementStateMap = Map<string, PreserveElementState>;

export interface VirtualRender {
  (parent: HTMLElement, vElem: VirtualElement, elemKey?: string): DomCompatibleElement | DomCompatibleElement[];
}
