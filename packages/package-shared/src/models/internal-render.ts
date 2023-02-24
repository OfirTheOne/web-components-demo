import { VirtualElement } from "./virtual-element";

export interface InternalRender {
    (
        vElem: VirtualElement, 
        domHost: Pick<HTMLElement, 'appendChild'>, 
        domElement?: Pick<HTMLElement, 'replaceWith'>
    ): HTMLElement;
}