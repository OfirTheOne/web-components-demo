import { Props } from "../../models/props";
import { VirtualElement } from "../../models/virtual-element";


export const createElement = (
    tag: string | Function, 
    props: Props, 
    ...children: Array<VirtualElement|string>
): VirtualElement => {
    const flatChildren = children.flat();
    const nonEmptyChildren = flatChildren.map(c => 
        (typeof c === 'string' && c.trim().length === 0) ?  null : c );

    
    tag
    return {
        tag,
        props, 
        children: nonEmptyChildren
    };
}