import { VirtualElement } from "./virtual-element";

export interface InternalRender {
    (
        vElem: VirtualElement, 
    ): HTMLElement | HTMLElement[];
}