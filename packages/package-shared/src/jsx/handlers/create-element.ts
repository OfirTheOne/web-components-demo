import { Props } from "../../models/props";
import { VirtualElement } from "../../models/virtual-element";


export const createElement = (
    tag: string | Function, 
    props: Props, 
    ...children: Array<VirtualElement|string>
): VirtualElement => {
    const flatChildren = children.flat();
    const nonEmptyChildren = flatChildren.filter(c =>  
        (typeof c == 'string' && c.trim().length > 0) || 
        (typeof c != 'string' && c !== null && c != undefined));
    return {
        tag,
        props, 
        children: nonEmptyChildren
    };
}