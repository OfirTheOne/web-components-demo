import { FC } from "../../../../models/functional-component";
import { DynamicTemplate, Trackable } from "../../models";
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
SlotComponent['$$dynamic-template'] = Symbol.for(DynamicTemplate.Slot);

export const Slot: FC<SlotProps> 
    = signalComponent(SlotComponent)
