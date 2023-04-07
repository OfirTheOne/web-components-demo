import { IComponentContainer } from "../../models/i-component-container";
import { IRenderContext, HookSlot, HookType } from "../../models/i-render-context";
import { ITaskAgent } from "../../models/i-task-agent";
import { StateChangesQueue } from "../render-task-agent/state-change-queue";
import { TaskAgent } from "../render-task-agent/async-render-task-agent";

export class RenderContext implements IRenderContext {
  componentContainerRef: IComponentContainer;
  renderTaskAgent: ITaskAgent;
  stateChangesQueue: StateChangesQueue;
  hookSlotList: HookSlot[];
  key: string;
  private _hookCounter: number = 0;
  get hookCounter() {
    return this._hookCounter;
  }

  constructor(componentContainerRef: IComponentContainer, key: string) {
    this.componentContainerRef = componentContainerRef;
    this.key = key;
    this.stateChangesQueue = new StateChangesQueue();
    this.renderTaskAgent = new TaskAgent(
      () => {
        this.stateChangesQueue.runChanges();
        this.stateChangesQueue.clear();
        this.componentContainerRef.render();
      }
    );
    this.hookSlotList = [];
  }

  projectState<HS extends HookSlot = HookSlot>(hookIndex: number): HS | null {
    return (this.hookSlotList[hookIndex] || null) as HS;
  }

  declareHook(type: HookType) {
    this.incHookCounter();
    if (this.hookSlotList.length < this._hookCounter) {
      this.hookSlotList.push({
        type,
        value: null,
        initialized: false,
      });
    }
  }

  incHookCounter() {
    this._hookCounter = this._hookCounter + 1;
  }

  resetHookCounter() {
    this._hookCounter = 0;
  }

  resetProjectState() {
    this.resetHookCounter();
  }
}
