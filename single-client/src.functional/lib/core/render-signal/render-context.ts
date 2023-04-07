import { IComponentContainer } from "../../models/i-component-container";
import {
  IRenderContext,
  HookSlot,
  HookType,
} from "../../models/i-render-context";
import { ITaskAgent } from "../../models/i-task-agent";
import { ActionQueue } from "../render-task-agent/state-change-queue";
import { TaskAgent } from "../render-task-agent/async-render-task-agent";

export class RenderContext implements IRenderContext {
  key: string;
  hookSlotList: HookSlot[];
  componentContainerRef: IComponentContainer;
  effectTaskAgent: ITaskAgent;
  effectQueue: ActionQueue;
  renderTaskAgent: ITaskAgent;
  stateChangesQueue: ActionQueue;

  private _hookCounter: number = 0;
  get hookCounter() {
    return this._hookCounter;
  }

  constructor(componentContainerRef: IComponentContainer, key: string) {
    this.componentContainerRef = componentContainerRef;
    this.key = key;
    this.effectQueue = new ActionQueue();
    this.effectTaskAgent = new TaskAgent(() => {
      this.effectQueue.runAll();
      this.effectQueue.clear();
    });
    this.stateChangesQueue = new ActionQueue();
    this.renderTaskAgent = new TaskAgent(() => {
      this.stateChangesQueue.runAll();
      this.stateChangesQueue.clear();
      this.componentContainerRef.render();
    });
    this.hookSlotList = [];
  }

  public getHookSlot<HS extends HookSlot = HookSlot>(
    hookIndex: number
  ): HS | null {
    return (this.hookSlotList[hookIndex] || null) as HS;
  }

  public declareHook(type: HookType): void {
    this.incHookCounter();
    if (this.hookSlotList.length < this._hookCounter) {
      this.hookSlotList.push({
        type,
        value: null,
        initialized: false,
      });
    }
  }

  public cleanup(): void {
    this.resetHookCounter();
  }

  protected incHookCounter() {
    this._hookCounter = this._hookCounter + 1;
  }

  protected resetHookCounter() {
    this._hookCounter = 0;
  }
}
