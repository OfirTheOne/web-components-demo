import { VirtualElement } from "../../../../models/virtual-element";
import { IPresentable } from "../../../../models/i-presentable";
import { RenderTaskAgent } from "./render-task-agent";
import { StateChangesQueue } from "./state-change-queue";
import { StateProxy } from "./state-proxy";
import { PreserveElementStateMap, InternalRender } from "../types";
import { WCContainerOptions } from "../../../../models/wc-container-options";
import { PresentableMeta } from "../../../../models/container-meta";

const styleElementsMap = new Map<string, HTMLStyleElement>();

const defaultWCContainerOptions: WCContainerOptions = {
  renderOnce: false,
  noWrap: false,
  staticStyle: true,
};

export class WCContainer extends HTMLElement {
  protected readonly preservedStateMap: PreserveElementStateMap;

  protected readonly _host: HTMLElement;
  protected readonly _shadow: ShadowRoot;
  protected styleContainer: HTMLStyleElement;
  protected container: HTMLElement | HTMLElement[];

  protected readonly _renderTaskAgent: RenderTaskAgent;
  protected readonly _stateChangesQueue: StateChangesQueue;
  protected _state: Record<string, any>;
  protected _stateProxy: Record<string, any>;

  public get host(): HTMLElement {
    return this._host;
  }
  private get isRenderOnce() {
    return this.container !== undefined;
  }

  constructor(
    protected readonly options: WCContainerOptions = defaultWCContainerOptions,
    protected readonly presentable: IPresentable,
    protected readonly props: Record<string, any> = {},
    protected readonly _children: any[] = [],
    protected readonly _render: InternalRender,
    protected readonly _meta: PresentableMeta
  ) {
    super();
    this._host = this;
    this.preservedStateMap = new Map();
    // this._styleElement = document.createElement("style");
    this._shadow = this.buildShadow();
    this.injectState({});
    this._stateChangesQueue = new StateChangesQueue();
    this._renderTaskAgent = new RenderTaskAgent(this, () => {
      this._stateChangesQueue.runChanges();
      this._stateChangesQueue.clear();
    });
  }

  injectState(state: any) {
    this._state = state;
    this._stateProxy = StateProxy.create(this._state);
    this.connectState();
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

  public render(): WCContainer | HTMLElement | HTMLElement[] {
    if (this.canRender() && this.shouldRender()) {
      this.preCoreRender();
      const wasRendered = this.coreRender();
      this.postCoreRender();
      if (!wasRendered) {
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
    if (this._shadow && this.presentable) {
      return true;
    } else {
      return false;
    }
  }
  private shouldRender(): boolean {
    if (this.isRenderOnce && this.options.renderOnce) {
      return false;
    } else {
      return true;
    }
  }
  private preCoreRender(): void {
    if (typeof this.presentable["preRender"] === "function") {
      this.presentable["preRender"]();
    }
  }
  private _renderStyle(): HTMLStyleElement | undefined {
    let styleElement: HTMLStyleElement | undefined;

    if (
      this.presentable.buildStyle &&
      typeof this.presentable.buildStyle == "function"
    ) {
      const componentStyle = this.presentable.buildStyle(this.props);
      if (componentStyle) {
        if (typeof componentStyle == "string") {
          styleElement = document.createElement("style");
          styleElement.textContent = componentStyle;
        } else if (typeof componentStyle.use == "function") {
          if (!styleElementsMap.has(this._meta.presentableName)) {
            componentStyle.use({
              target: this._shadow,
              registerStyle: (stlElm) =>
                styleElementsMap.set(this._meta.presentableName, stlElm),
            });
          }
          styleElement = styleElementsMap.get(this._meta.presentableName);
        }
      }
    }

    return styleElement;
  }
  private coreRender(): boolean {
    const virtualElement = this.presentable.buildTemplate(
      this.props,
      this._children
    ) as unknown as VirtualElement;

    if (virtualElement == null) {
      return false;
    }

    const domStyleElement = this._renderStyle();
    const domElement = this._render(virtualElement, this.preservedStateMap);
    
    DOMHelpers.removeSelf(this.styleContainer);
    this.styleContainer = domStyleElement
    DOMHelpers.removeSelf(this.container);
    this.container = domElement;
    if(this.styleContainer) {
        this.appendToShadow(this.styleContainer);
    }
    this.appendToShadow(this.container);

    return !!domElement;
  }
  private postCoreRender(): void {
    if (typeof this.presentable["postRender"] === "function") {
      this.presentable["postRender"]();
    }
  }
  protected setState(
    assignedState:
      | Record<string, any>
      | ((cur: Record<string, any>) => Record<string, any>)
  ): any {
    const actualAssignedState =
      typeof assignedState === "function"
        ? assignedState(this._stateProxy)
        : assignedState;
    if (actualAssignedState !== this._stateProxy) {
      this._stateChangesQueue.pushStateChange(this._state, actualAssignedState);
    }
    this._renderTaskAgent.registerRender();
  }

  protected connectState() {
    this.presentable["state"] = this._stateProxy;
    this.presentable["setState"] = this.setState.bind(this);
  }
  protected buildShadow() {
    return this._host.attachShadow({ mode: "open" });
  }
  protected buildContainer(
    containerElementOrTag: keyof HTMLElementTagNameMap | HTMLElement
  ) {
    const container =
      typeof containerElementOrTag == "string"
        ? document.createElement(containerElementOrTag)
        : containerElementOrTag;
    return container;
  }
  protected appendToShadow(elem: HTMLElement | HTMLElement[]): void {
    Array.isArray(elem)
      ? elem.forEach((node) => this._shadow.appendChild(node))
      : this._shadow.appendChild(elem);
  }
}

class DOMHelpers {
  static removeSelf(elm?: HTMLElement | HTMLElement[]) {
    if (elm) {
      Array.isArray(elm) ? elm.forEach((node) => node.remove()) : elm.remove();
    }
  }
}
