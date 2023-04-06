import { IComponentContainer } from "../../models/i-component-container";
import { IRenderContext, HookSlot, HookType } from "../../models/i-render-context";
import { IRenderTaskAgent } from "../../models/i-render-task-agent";
import { StateChangesQueue } from "../render-task-agent/state-change-queue";
import { AsyncRenderTaskAgent } from "../render-task-agent/async-render-task-agent";

export class RenderContext implements IRenderContext {
  componentContainerRef: IComponentContainer;
  renderTaskAgent: IRenderTaskAgent;
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
    this.renderTaskAgent = new AsyncRenderTaskAgent(
      componentContainerRef,
      () => {
        this.stateChangesQueue.runChanges();
        this.stateChangesQueue.clear();
      }
    );
    this.hookSlotList = [];
  }

  projectState(hookIndex: number) {
    return this.hookSlotList[hookIndex] || null;
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
