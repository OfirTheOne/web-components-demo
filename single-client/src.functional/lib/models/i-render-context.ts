import { StateChangesQueue } from "../core/render-task-agent/state-change-queue";
import { IComponentContainer } from "./i-component-container";
import { IRenderTaskAgent } from "./i-render-task-agent";


export interface HookSlot {
    value?: any;
    initialized: boolean;
}

export interface IRenderContext {
    componentContainerRef: IComponentContainer,
    renderTaskAgent: IRenderTaskAgent;
    stateChangesQueue: StateChangesQueue;
    hookSlotList: Array<HookSlot>;
    // props: Record<any, any>;
    key: string;
}


