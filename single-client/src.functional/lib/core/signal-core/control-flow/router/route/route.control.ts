import { FC } from "../../../../../models/functional-component";
import { ControlFlow } from "../../../models";
import { signalComponent } from "../../../signal-component/signal-component";

export interface RevalidateFn {
    (location: string, params: Record<string, string>, state: unknown) : boolean

} 

export type RouteProps =  {
    path: string;
    revalidate?: RevalidateFn;
    component?: JSX.Element | FC<{ location: string, params: Record<string, string>, state: any }>
} 


function RouteComponent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: RouteProps, 
    children: JSX.Element
): JSX.Element {
    return children;
}
RouteComponent['$$control-flow'] = Symbol.for(ControlFlow.Route);

export const Route: FC<RouteProps> 
    = signalComponent(RouteComponent)
