import { Props } from "../../models/props";
import { VirtualElement } from "../../models/virtual-element";


export const createElement = (
    tag: string | Function, 
    props: Props, 
    ...children: Array<VirtualElement|string>
): VirtualElement => {
    return {
        tag,
        props, 
        children
    };
}