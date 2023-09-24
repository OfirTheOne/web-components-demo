import { FC } from "../../../../models/functional-component";
import { ControlFlow, } from "../../models";
import { Trackable } from "../../signal";

import { signalComponent } from "../../signal-component/signal-component";



export type SlotProps =  {
    track: Trackable[]
}



function SlotComponent(props: SlotProps, children: JSX.Element): JSX.Element;
function SlotComponent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: SlotProps, 
    children: JSX.Element
): JSX.Element {
    return children;
}
SlotComponent['$$control-flow'] = Symbol.for(ControlFlow.Slot);

export const Slot: FC<SlotProps> 
    = signalComponent(SlotComponent)
