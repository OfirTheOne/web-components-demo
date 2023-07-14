import { createElement } from "../../../../../jsx";
import { FC } from "../../../../../models/functional-component";
import { VirtualElement } from "../../../../../models";
import { signalComponent } from "../../../signal-component/signal-component";
import { history } from "../../../../../common/router";
// import { ControlFlow } from "../../models";
 

export type LinkProps =  {
    path: string;
    tag?: keyof HTMLElementTagNameMap;
    className?: string;
    style?: Record<string, string>;
} 


function LinkComponent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: LinkProps, 
    children: JSX.Element
): JSX.Element {
    return  createElement(_props.tag || 'a', {
        className: _props.className,
        style: _props.style || {},
        onClick: (e) => {
            e?.preventDefault?.();
            history.pushState(_props.path);
        }
    }, children as unknown as VirtualElement) as unknown as JSX.Element;
}

export const Link: FC<LinkProps> 
    = signalComponent(LinkComponent)
