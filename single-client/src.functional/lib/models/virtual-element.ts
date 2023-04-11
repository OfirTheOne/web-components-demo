import { Props } from "./props";


export interface VirtualElement {
    tag: string | ((...args: unknown[]) => VirtualElement), 
    props: Props, 
    children: Array<VirtualElement | string>
}