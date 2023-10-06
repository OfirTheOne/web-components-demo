import { Trackable } from "@sigjs/signal";
import { FC } from "@/models/functional-component";
import { ControlFlow } from "../../models";
import { signalComponent } from "../../signal-component/signal-component";

export interface SwitchProps {
    fallback?: JSX.Element;
    track: Trackable[]
} 
function SwitchComponent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: SwitchProps, 
    children: JSX.Element
): JSX.Element {
    return children;
}
SwitchComponent['$$control-flow'] = Symbol.for(ControlFlow.Switch);
export const Switch: FC<SwitchProps> = signalComponent(SwitchComponent)


export interface CaseProps {
    when: (trackedValues: any[]) => boolean;
} 
const CaseComponent = function CaseComponent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: object, 
    children: JSX.Element
): JSX.Element {
    return children;
}
CaseComponent['$$control-flow'] = Symbol.for(ControlFlow.Case);
export const Case: FC<CaseProps> = signalComponent(CaseComponent)

