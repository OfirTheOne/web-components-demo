import { DomCompatibleElement } from './dom-element';
import { VirtualElement } from './virtual-element';
import { OneOrMany } from '../types/utils';

export interface VirtualRender {
  (parent: HTMLElement, vElem: VirtualElement, elemKey?: string): OneOrMany<DomCompatibleElement>;
}
