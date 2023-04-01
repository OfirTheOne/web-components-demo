import { DomCompatibleElement } from "../models/dom-element";
import { VirtualElement } from "../models/virtual-element";

export interface PreserveElementState<E extends HTMLElement = HTMLElement> {
    state: Record<any, any>;
    preserved?: E;
    componentInstance: any
}

export type PreserveElementStateMap = Map<string, PreserveElementState>;  

export interface InternalRender {
    (
        vElem: VirtualElement, 
        parent: HTMLElement,
        // parentPreservedStateMap?: PreserveElementStateMap
    ): DomCompatibleElement | DomCompatibleElement[];
}