import { IPresentable, SetState } from "../../../../models/i-presentable";
import { WCContainerOptions } from "../../../../models/wc-container-options";
import { PresentableMeta } from "../../../../models/container-meta";
import { PreserveElementStateMap, InternalRender } from "../types";
import { RenderTaskAgent } from "./render-task-agent";
import { StateChangesQueue } from "./state-change-queue";
import { StateProxy } from "./state-proxy";
import { DOMHelpers } from "./dom-helpers";
import { DomCompatibleElement } from "../../../../models/dom-element";
import { RenderUtils } from "../render-utils";
import { ComponentKeyBuilder as ComponentKey } from "../component-key-builder";

const defaultWCContainerOptions: WCContainerOptions = {
  renderOnce: false,
  noWrap: false,
  staticStyle: true,
};

export class WCContainer extends HTMLElement {
  protected readonly _preservedStateMap: PreserveElementStateMap;
  protected readonly _host: HTMLElement;
  protected readonly _shadow: ShadowRoot;
  protected readonly _renderTaskAgent: RenderTaskAgent;
  protected readonly _stateChangesQueue: StateChangesQueue;
  protected _state: Record<string, any>;
  protected _stateProxy: Record<string, any>;
  protected styleContainer: HTMLStyleElement;
  protected container: HTMLElement | HTMLElement[];

  public get key(): string {
    return this._key;
  }
  public get host(): HTMLElement {
    return this._host;
  }
  private get wasRenderedBefore() {
    return this.container !== undefined;
  }
  public get isUsingShadowRoot() {
    return this.options.noWrap !== true;
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
    super();
    this._host = this;
    this._preservedStateMap = new Map();
    this._shadow = DOMHelpers.buildShadow(this._host);
    this._stateChangesQueue = new StateChangesQueue();
    this._renderTaskAgent = new RenderTaskAgent(
      { render: () => this.render() },
      () => {
        this._stateChangesQueue.runChanges();
        this._stateChangesQueue.clear();
      }
    );
  }

  connectedCallback(...args: unknown[]) {
    if (typeof this.presentable?.["connectedCallback"] === "function") {
      <Function>this.presentable["connectedCallback"](...args);
    }
  }
  disconnectedCallback(...args: unknown[]) {
    if (typeof this.presentable?.["disconnectedCallback"] === "function") {
      <Function>this.presentable["disconnectedCallback"](...args);
    }
  }
  attributeChangedCallback(...args: unknown[]) {
    if (typeof this.presentable?.["attributeChangedCallback"] === "function") {
      <Function>this.presentable["attributeChangedCallback"](...args);
    }
  }
  adoptedCallback(...args: unknown[]) {
    if (typeof this.presentable?.["adoptedCallback"] === "function") {
      <Function>this.presentable["adoptedCallback"](...args);
    }
  }

  public injectState(state: any) {
    this._state = state;
    this._stateProxy = StateProxy.create(this._state);
    this.connectState();
  }

  public render(): WCContainer | HTMLElement | HTMLElement[] {
    if (this.canRender() && this.shouldRender()) {
      this.preCoreRender();
      const { domStyleElement, domElement } = this.coreRender();

      if (!this.isUsingShadowRoot && this._parent) {
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
      } else {
        this.detachFromShadowParent();
        this.reattachToShadowParent(domStyleElement, domElement);
      }
      this.postCoreRender();
      if (!domElement) {
        return null;
      }
    }
    if (this.options.noWrap) {
      return this.container;
    } else {
      return this;
    }
  }

  private canRender(): boolean {
    return !!(this._shadow && this.presentable && this._stateProxy);
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
          ComponentKey.build()
            .root()
            .tag(this._meta.presentableName)
            .fragment()
            .idx(i)
            .tag(n.tagName)
            .toString()
        )
      );
    } else if (this.container) {
      const tagName = this.container.tagName;
      this.container.setAttribute(
        "virtual_key",
        ComponentKey.build()
          .root()
          .tag(this._meta.presentableName)
          .idx(0)
          .tag(tagName)
          .toString()
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
        domStyleElement: undefined,
      };
    }
    if (!this.isUsingShadowRoot) {
      return {
        domElement,
        domStyleElement: undefined,
      };
    }
    const domStyleElement = RenderUtils.renderStyle(
      this.presentable,
      this._meta.presentableName,
      this._props
    );
    return {
      domElement,
      domStyleElement,
    };
  }

  private detachFromShadowParent() {
    if (this.isUsingShadowRoot) {
      DOMHelpers.removeSelf(this.styleContainer);
      DOMHelpers.removeSelf(this.container);
    }
  }

  private reattachToShadowParent(
    domStyleElement: HTMLStyleElement | undefined,
    domElement: DomCompatibleElement | DomCompatibleElement[] | undefined
  ) {
    if (this.isUsingShadowRoot) {
      this.styleContainer = domStyleElement;
      this.container = <HTMLElement | HTMLElement[]>domElement;
      DOMHelpers.appendToParent(this._shadow, this.styleContainer);
      DOMHelpers.appendToParent(this._shadow, this.container);
    }
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
