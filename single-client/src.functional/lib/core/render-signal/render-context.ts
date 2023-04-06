import { IComponentContainer } from "src.functional/lib/models/i-component-container";
import { IRenderContext } from "src.functional/lib/models/i-render-context";
import { IRenderTaskAgent } from "src.functional/lib/models/i-render-task-agent";
import { StateChangesQueue } from "../render-task-agent/state-change-queue";
import { AsyncRenderTaskAgent } from "../render-task-agent/async-render-task-agent";

export class RenderContext implements IRenderContext {
//   projectedState: { value?: any; initialized: boolean };
  componentContainerRef: IComponentContainer;
  renderTaskAgent: IRenderTaskAgent;
  stateChangesQueue: StateChangesQueue;
  stateHolder: {
    value: any,
    initialized: boolean,
  }[];
  props: Record<any, any>;
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
    this.stateHolder = [];
  }

  projectState(hookIndex: number) {
    return this.stateHolder[hookIndex] || null;
  }

  declareHook() {
    this.incHookCounter();
    if (this.stateHolder.length < this._hookCounter) {
      this.stateHolder.push({
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
    // this.projectedState = null;
    this.resetHookCounter();
  }
}
