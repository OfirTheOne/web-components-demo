import { StateChangesQueue } from "../core/render-task-agent/state-change-queue";
import { IComponentContainer } from "./i-component-container";
import { ITaskAgent } from "./i-task-agent";


export enum HookType {
    createSignal,
    createRef,
    useEffect,
    useCallback,
    useMemo,
}

export interface HookSlot {
    type: HookType
    value?: any;
    initialized: boolean;
}

export interface IRenderContext {
    componentContainerRef: IComponentContainer,
    renderTaskAgent: ITaskAgent;
    stateChangesQueue: StateChangesQueue;
    hookSlotList: Array<HookSlot>;
    key: string;
}


