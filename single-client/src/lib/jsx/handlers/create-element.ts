import { isPresentable } from "../../utils/is-presentable";
import { Props } from "../../models/props";
import { VirtualElement } from "../../models/virtual-element";
import { FRAGMENT_FACTORY_NAME } from "../../constants";



export const createElement = (
    tag: string | Function, 
    props: Props, 
    ...children: Array<VirtualElement|string>
): VirtualElement => {
    if(typeof tag == 'function' && (tag.name !== FRAGMENT_FACTORY_NAME && !isPresentable(tag))) {
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