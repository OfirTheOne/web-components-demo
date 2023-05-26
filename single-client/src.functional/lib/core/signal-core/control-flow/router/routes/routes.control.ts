import { FC } from "../../../../../models/functional-component";
import { ControlFlow } from "../../../models";
import { signalComponent } from "../../../signal-component/signal-component";
import { IHistoryAdapter } from "../../../../../common/router/history-adapter";

export type RoutesProps =  {
    history: IHistoryAdapter;
} 

function RoutesComponent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: RoutesProps, 
    children: JSX.Element
): JSX.Element {
    return children;
}
RoutesComponent['$$control-flow'] = Symbol.for(ControlFlow.Routes);

export const Routes: FC<RoutesProps> 
    = signalComponent(RoutesComponent)
