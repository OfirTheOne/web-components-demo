import { Props } from "./props";


export interface VirtualElement {
    tag: string | Function, 
    props: Props, 
    children: Array<VirtualElement | string>
}