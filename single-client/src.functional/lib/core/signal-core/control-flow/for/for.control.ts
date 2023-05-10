import { FC } from "../../../../models/functional-component";
import { ControlFlow, Trackable } from "../../models";
import { signalComponent } from "../../signal-component/signal-component";

export interface ForProps<A extends Array<unknown> = Array<unknown>> {
    each: Trackable<A>;
    indexKey?: string;
} 

function ForComponent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: ForProps, 
    children: JSX.Element
): JSX.Element {
    return children;
}
ForComponent['$$control-flow'] = Symbol.for(ControlFlow.For);
export const For: FC<ForProps> = signalComponent(ForComponent)


/*

<For each={items} indexKey >
    {item => <div>{item}</div>}
</For>


*/