import { isPresentable } from "../../utils/is-presentable";
import { Props } from "../../models/props";
import { VirtualElement } from "../../models/virtual-element";


export const createElement = (
    tag: string | Function, 
    props: Props, 
    ...children: Array<VirtualElement|string>
): VirtualElement => {
    if(typeof tag == 'function' && !isPresentable(tag)) {
        throw new Error(`Invalid function used as JSX.Element`);
    }
 
    const flatChildren = children.flat();
    const nonEmptyChildren = flatChildren.map(c => 
        (typeof c === 'string' && c.trim().length === 0) ?  null : c );
   
    return {
        tag,
        props, 
        children: nonEmptyChildren
    };
}