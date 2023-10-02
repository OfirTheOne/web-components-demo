import { Trackable } from "@sig/signal";
import { FC } from "@/models/functional-component";
import { ControlFlow } from "../../models";

import { signalComponent } from "../../signal-component/signal-component";

export interface ForProps<A extends Array<unknown> = Array<unknown>> {
    each: Trackable<A>;
    indexKey?: string;
    index?: boolean | string | ((item: unknown, index: number) => unknown);
} 

function ForComponent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: ForProps, 
    children: JSX.Element
): JSX.Element {
    return children;
} 
ForComponent['$$control-flow'] = Symbol.for(ControlFlow.For);
export const For: FC<ForProps> = signalComponent(ForComponent as FC<ForProps>)


/*

<For each={items} indexKey >
    {item => <div>{item}</div>}
</For>


*/