import { Props } from "../../models/props";
import { VirtualElement } from "../../models/virtual-element";


export const createElement = (
    tag: string | Function, 
    props: Props, 
    ...children: Array<VirtualElement|string>
): VirtualElement => {
    const flatChildren = children.flat();
    const nonEmptyChildren = flatChildren.map(c =>  {
        if(typeof c === 'string' && c.trim().length === 0) {
            return null;
        } else {
            return c
        }
    });
    return {
        tag,
        props, 
        children: nonEmptyChildren
    };
}