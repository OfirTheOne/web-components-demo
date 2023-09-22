import { DomCompatibleElement } from './dom-element';
import { VirtualElement } from './virtual-element';
import { OneOrMany } from '../types/one-or-many';

export interface VirtualRender {
  (parent: HTMLElement, vElem: VirtualElement, elemKey?: string): OneOrMany<DomCompatibleElement>;
}
