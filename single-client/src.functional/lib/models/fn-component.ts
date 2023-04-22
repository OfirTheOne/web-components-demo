import { Props } from "./props";
import { VirtualElement } from "./virtual-element";

export interface FnComponent{
    (props: Props, children: any[]): VirtualElement
}