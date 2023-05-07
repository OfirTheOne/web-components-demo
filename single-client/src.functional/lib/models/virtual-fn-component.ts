import { Props } from "./props";
import { VirtualElement } from "./virtual-element";

export interface VirtualFnComponent{
    (props: Props, children: any[]): VirtualElement
}