import { StateChangesQueue } from "../core/render-task-agent/state-change-queue";
import { IComponentContainer } from "./i-component-container";


export interface RenderContext {
    projectedState: {
        value?: any
        initialized: boolean;
    },
    componentContainerRef: IComponentContainer,
    stateChangesQueue: StateChangesQueue;
    stateHolder: Array<any>, 
    props: Record<any, any>;
    key: string;
}