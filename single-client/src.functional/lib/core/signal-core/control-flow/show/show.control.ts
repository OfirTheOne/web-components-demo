import { FC } from "../../../../models/functional-component";
import { ControlFlow, Trackable } from "../../models";
import { signalComponent } from "../../signal-component/signal-component";

export type ShowPropsWithoutTrack =  {
    when: Trackable;
    fallback?: JSX.Element;
} 
export type ShowPropsWithTrack =  {
    when: (trackedValues: any[]) => boolean;
    fallback?: JSX.Element;
    track: Trackable[]
}



function ShowComponent(props: ShowPropsWithTrack, children: JSX.Element): JSX.Element;
function ShowComponent(props: ShowPropsWithoutTrack, children: JSX.Element): JSX.Element;
function ShowComponent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: ShowPropsWithTrack | ShowPropsWithoutTrack, 
    children: JSX.Element
): JSX.Element {
    return children;
}
ShowComponent['$$dynamic-template'] = Symbol.for(ControlFlow.Show);

export const Show: FC<ShowPropsWithTrack | ShowPropsWithoutTrack> 
    = signalComponent(ShowComponent)
