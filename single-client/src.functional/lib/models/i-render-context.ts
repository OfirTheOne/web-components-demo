import { ActionQueue } from '../core/state-core/render-context/task-agent/action-queue';
import { IComponentContainer } from './i-component-container';
import { ITaskAgent } from './i-task-agent';

export enum HookType {
  createState,
  createRef,
  createCallback,
  useEffect,
  useContext,
  createMemo,
}

export interface HookSlot {
  type: HookType;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  value?: any;
  initialized: boolean;
}

export interface MemoHookSlot {
  type: HookType;
  value?: any;
  initialized: boolean;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  dependencies: any[];
}

export interface EffectHookSlot extends MemoHookSlot {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  value: () => void | (() => any);
  dependencies: any[];
  onUnmount: () => any;
  initialized: boolean;
}

export interface IRenderContext {
  componentContainerRef: IComponentContainer;
  effectTaskAgent: ITaskAgent;
  effectQueue: ActionQueue;
  renderTaskAgent: ITaskAgent;
  stateChangesQueue: ActionQueue;
  hookSlotList: Array<HookSlot>;
  key: string;
}
