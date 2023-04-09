import { ActionQueue } from "../core/task-agent/action-queue";
import { IComponentContainer } from "./i-component-container";
import { ITaskAgent } from "./i-task-agent";


export enum HookType {
    createSignal,
    createRef,
    createCallback,
    useEffect,
    useMemo,
}

export interface HookSlot {
    type: HookType
    value?: any;
    initialized: boolean;
}



export interface MemoHookSlot {
    type: HookType
    value?: any;
    initialized: boolean;
    dependencies: any[];
}


export interface EffectHookSlot extends MemoHookSlot {
    value: () => (void | (() => any));
    dependencies: any[]
    onUnmount: () => any;
    initialized: boolean;
}


export interface IRenderContext {
    componentContainerRef: IComponentContainer,
    effectTaskAgent: ITaskAgent;
    effectQueue: ActionQueue;
    renderTaskAgent: ITaskAgent;
    stateChangesQueue: ActionQueue;
    hookSlotList: Array<HookSlot>;
    key: string;
}


