import { Trackable } from "@sigjs/signal";import { ControlFlow } from "../../models";
import { ArrayOfType } from "@/types"

export interface ForProps<A extends Array<unknown> = Array<unknown>> {
    each: Trackable<A>;
    indexKey?: string;
    index?: boolean | string | ((item: ArrayOfType<A>, index: number) => unknown);
} 

function ForComponent<A extends Array<unknown> = Array<unknown>>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: ForProps<A>, 
    children: JSX.Element
): JSX.Element {
    return children;
} 
ForComponent['$$control-flow'] = Symbol.for(ControlFlow.For);
export const For = ForComponent; //: FC<ForProps> = signalComponent(ForComponent as FC<ForProps>)


/*

<For each={items} indexKey >
    {item => <div>{item}</div>}
</For>


*/