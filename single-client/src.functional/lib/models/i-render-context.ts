import { StateChangesQueue } from "../core/render-task-agent/state-change-queue";
import { IComponentContainer } from "./i-component-container";
import { IRenderTaskAgent } from "./i-render-task-agent";


export interface IRenderContext {
    // projectedState: {
    //     value?: any
    //     initialized: boolean;
    // },
    componentContainerRef: IComponentContainer,
    renderTaskAgent: IRenderTaskAgent;
    stateChangesQueue: StateChangesQueue;
    stateHolder: Array<{
        value?: any;
        initialized: boolean;
    }>;
    props: Record<any, any>;
    key: string;
}