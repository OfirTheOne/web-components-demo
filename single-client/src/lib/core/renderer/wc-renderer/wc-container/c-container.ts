import { IPresentable, SetState } from "../../../../models/i-presentable";
import { WCContainerOptions } from "../../../../models/wc-container-options";
import { PresentableMeta } from "../../../../models/container-meta";
import { PreserveElementStateMap, InternalRender } from "../types";
import { RenderTaskAgent } from "./render-task-agent";
import { StateChangesQueue } from "./state-change-queue";
import { StateProxy } from "./state-proxy";
import { DOMHelpers } from "./dom-helpers";
import { ComponentKeyToken } from "../component-key-token";
import { RenderUtils } from "../render-utils";


const defaultWCContainerOptions: WCContainerOptions = {
  renderOnce: false,
  noWrap: false,
  staticStyle: true,
};

export class CContainer {
  protected readonly _preservedStateMap: PreserveElementStateMap;
  protected readonly _renderTaskAgent: RenderTaskAgent;
  protected readonly _stateChangesQueue: StateChangesQueue;
  protected _state: Record<string, any>;
  protected _stateProxy: Record<string, any>;
  protected styleContainer: HTMLStyleElement;
  protected container: HTMLElement | HTMLElement[];
  public get key(): string {
    return this._key;
  }
  private get wasRenderedBefore() {
    return this.container !== undefined;
  }

  constructor(
    protected readonly options: WCContainerOptions = defaultWCContainerOptions,
    protected readonly presentable: IPresentable,
    protected readonly _parent: HTMLElement,
    protected readonly _props: Record<string, any> = {},
    protected readonly _key: string,
    protected readonly _children: any[] = [],
    protected readonly _render: InternalRender,
    protected readonly _meta: PresentableMeta
  ) {
    this._preservedStateMap = new Map();
    this._stateChangesQueue = new StateChangesQueue();
    this._renderTaskAgent = new RenderTaskAgent(
      { render: () => this.render() },
      () => {
        this._stateChangesQueue.runChanges();
        this._stateChangesQueue.clear();
      }
    );
  }

  public injectState(state: any) {
    this._state = state;
    this._stateProxy = StateProxy.create(this._state);
    this.connectState();
  }
  public render(): HTMLElement | HTMLElement[] {
    if (this.canRender() && this.shouldRender()) {
      this.preCoreRender();
      const { domElement } = this.coreRender();

      if (this._parent) {
        if (!this.wasRenderedBefore) {
          DOMHelpers.appendToParent(this._parent, <HTMLElement>domElement);
          this.container = <HTMLElement>domElement;
        } else {
          const firstContainerNode = Array.isArray(this.container)
            ? this.container[0]
            : this.container;
          const renderStartPointNode = (
            DOMHelpers.isOnlyChild(firstContainerNode)
              ? null
              : firstContainerNode.previousSibling
          ) as HTMLElement | null;
          DOMHelpers.removeSelf(this.container);
          DOMHelpers.insertChildAfterNode(
            this._parent,
            domElement,
            renderStartPointNode
          );
          this.container = <HTMLElement>domElement;
        }
      }
      this.postCoreRender();
      if (!domElement) {
        return null;
      }
    }
    return this.container;
  }

  private canRender(): boolean {
    return !!(this.presentable && this._stateProxy);
  }
  private shouldRender(): boolean {
    return !(this.wasRenderedBefore && this.options.renderOnce);
  }
  private preCoreRender(): void {
    if (typeof this.presentable["preRender"] === "function") {
      this.presentable["preRender"]();
    }
  }
  private postCoreRender(): void {
    if (Array.isArray(this.container)) {
      this.container.forEach((n, i) =>
        n?.setAttribute(
          "virtual_key",
          String(
            ComponentKeyToken.ROOT +
              ComponentKeyToken.SEPARATOR +
              this._meta.presentableName +
              ComponentKeyToken.SEPARATOR +
              ComponentKeyToken.FRAGMENT +
              ComponentKeyToken.SEPARATOR +
              `${i}` +
              ComponentKeyToken.SEPARATOR +
              n.tagName
          )
        )
      );
    } else if (this.container) {
      const tagName = this.container.tagName;
      this.container.setAttribute(
        "virtual_key",
        String(
          ComponentKeyToken.ROOT +
            ComponentKeyToken.SEPARATOR +
            this._meta.presentableName +
            ComponentKeyToken.SEPARATOR +
            `${0}` +
            ComponentKeyToken.SEPARATOR +
            tagName
        )
      );
    }

    if (typeof this.presentable["postRender"] === "function") {
      this.presentable["postRender"]();
    }
  }
  private coreRender() {
    const domElement = RenderUtils.renderElement(
      this._parent,
      this.presentable,
      this._props,
      this._children,
      this._preservedStateMap,
      this._render
    );
    if (!domElement) {
      return {
        domElement: undefined,
      };
    }
    return {
      domElement,
    };
  }
  private setState(assignedState: SetState<Record<string, any>>): void {
    const actualAssignedState =
      typeof assignedState === "function"
        ? assignedState(this._stateProxy)
        : assignedState;
    if (actualAssignedState !== this._stateProxy) {
      this._stateChangesQueue.pushStateChange(this._state, actualAssignedState);
    }
    this._renderTaskAgent.registerRender();
  }
  private connectState() {
    this.presentable["state"] = this._stateProxy;
    this.presentable["setState"] = this.setState.bind(this);
  }
}
