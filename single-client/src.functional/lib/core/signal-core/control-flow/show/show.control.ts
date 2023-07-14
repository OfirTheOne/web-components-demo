import { FC } from "../../../../models/functional-component";
import { ControlFlow, Trackable } from "../../models";
import { signalComponent } from "../../signal-component/signal-component";

export type ShowProps =  {
    when?: (trackedValues: any[]) => boolean;
    fallback?: JSX.Element;
    track: Trackable | Trackable[]
}

function ShowComponent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: ShowProps, 
    children: JSX.Element
): JSX.Element {
    return children;
}
ShowComponent['$$control-flow'] = Symbol.for(ControlFlow.Show);
export const Show: FC<ShowProps> = signalComponent(ShowComponent)
