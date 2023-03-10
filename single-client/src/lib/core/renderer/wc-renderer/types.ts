import { VirtualElement } from "../../../models/virtual-element";

export interface PreserveElementState<E extends HTMLElement = HTMLElement> {
    state: Record<any, any>;
    preserved?: E;
}

export type PreserveElementStateMap = Map<string, PreserveElementState>;  

export interface InternalRender {
    (
        vElem: VirtualElement, 
        parentPreservedStateMap?: PreserveElementStateMap
    ): HTMLElement | HTMLElement[];
}