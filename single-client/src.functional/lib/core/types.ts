import { DomCompatibleElement } from '../models/dom-element';
import { VirtualElement } from '../models/virtual-element';
import { OneOrMany } from '../types/utils';

export interface VirtualRender {
  (parent: HTMLElement, vElem: VirtualElement, elemKey?: string): OneOrMany<DomCompatibleElement>;
}
