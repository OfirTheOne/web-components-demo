import { VirtualElement } from "../../../../models/virtual-element";
import { IPresentable, SetState } from "../../../../models/i-presentable";
import { WCContainerOptions } from "../../../../models/wc-container-options";
import { PresentableMeta } from "../../../../models/container-meta";
import { PreserveElementStateMap, InternalRender } from "../types";
import { RenderTaskAgent } from "./render-task-agent";
import { StateChangesQueue } from "./state-change-queue";
import { StateProxy } from "./state-proxy";
import { DOMHelpers } from "./dom-helpers";
import { DomCompatibleElement } from "../../../../models/dom-element";
import { ComponentKeyToken } from "../component-key-token";

const styleElementsMap = new Map<string, HTMLStyleElement>();

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
  private get isRenderOnce() {
    return this.container !== undefined;
  }

  constructor(
    protected readonly options: WCContainerOptions = defaultWCContainerOptions,
    protected readonly presentable: IPresentable,
    protected readonly _parent: HTMLElement,
    protected readonly _props: Record<string, any> = {},
    protected readonly _key: string,
    protected readonly _children: any[] = [],
    // protected readonly _initState: any = {},
    protected readonly _render: InternalRender,
    protected readonly _meta: PresentableMeta
  ) {
    super();
    this._host = this;
    this._preservedStateMap = new Map();
    // this.injectState(this._initState);
    this._shadow = DOMHelpers.buildShadow(this._host);
    this._stateChangesQueue = new StateChangesQueue();
    this._renderTaskAgent = new RenderTaskAgent(this, () => {
      this._stateChangesQueue.runChanges();
      this._stateChangesQueue.clear();
    });
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
      
      if(this.options.noWrap) {
        if(this._parent) {
          if(!this.container) {
            DOMHelpers.appendToParent(this._parent, <HTMLElement>domElement);
            
          } else {
            const firstContainerNode = Array.isArray(this.container) ? this.container[0] : this.container;
            const renderStartPointNode = 
              (firstContainerNode.parentNode.children.length == 1 ? 
                null : firstContainerNode.previousSibling) as HTMLElement | null;     
            DOMHelpers.insertChildAfterNode(this._parent, domElement, renderStartPointNode)

          }
          // DOMHelpers.removeSelf(this.container);
        }
      } else {

      }
      this.detachFromParent();
      this.reattachToParent(domStyleElement, domElement);
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
    if (this._shadow && this.presentable && this._stateProxy) {
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
      ComponentKeyToken;
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
    const domElement = renderElement(
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
    if (this.options.noWrap) {
      return {
        domElement,
        domStyleElement: undefined,
      };
    }
    const domStyleElement = renderStyle(
      this.presentable,
      this._meta.presentableName,
      this._props
    );

    return {
      domElement,
      domStyleElement,
    };
    // DOMHelpers.removeSelf(this.styleContainer);
    // this.styleContainer = domStyleElement;
    // DOMHelpers.removeSelf(this.container);
    // this.container = domElement;
    // if (this.styleContainer) {
    //   DOMHelpers.appendToShadow(this._shadow, this.styleContainer);
    // }
    // DOMHelpers.appendToShadow(this._shadow, this.container);
    // return !!domElement;
  }

  private detachFromParent() {
    if( this.options.noWrap) {

    } else {
      DOMHelpers.removeSelf(this.styleContainer);
      DOMHelpers.removeSelf(this.container);
    }
  }

  private reattachToParent(
    domStyleElement: HTMLStyleElement | undefined,
    domElement: DomCompatibleElement | DomCompatibleElement[] | undefined
  ) {
    this.styleContainer = domStyleElement;
    this.container = <HTMLElement | HTMLElement[]>domElement;
    DOMHelpers.appendToParent(this._shadow, this.styleContainer);
    DOMHelpers.appendToParent(this._shadow, this.container);
  }

  selfRender() {}

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

function renderStyle(
  presentable: IPresentable,
  presentableName: string,
  props: Record<string, any>
): HTMLStyleElement | undefined {
  let styleElement: HTMLStyleElement | undefined;
  if (presentable.buildStyle && typeof presentable.buildStyle == "function") {
    const componentStyle = presentable.buildStyle(props);
    if (typeof componentStyle === "string") {
      styleElement = document.createElement("style");
      styleElement.textContent = componentStyle;
    } else if (typeof componentStyle?.use === "function") {
      if (!styleElementsMap.has(presentableName)) {
        componentStyle.use({
          registerStyle: (s) => styleElementsMap.set(presentableName, s),
        });
      }
      styleElement = styleElementsMap.get(presentableName);
    }
  }
  return styleElement;
}

function renderElement(
  parent: HTMLElement,
  presentable: IPresentable,
  props: Record<string, any>,
  children: any[],
  preservedStateMap: PreserveElementStateMap,
  render: InternalRender
): DomCompatibleElement | DomCompatibleElement[] | undefined {
  const virtualElement = presentable.buildTemplate(
    props,
    children
  ) as unknown as VirtualElement;

  if (virtualElement == null) {
    return undefined;
  }
  const domElement = render(virtualElement, parent, preservedStateMap);
  return domElement;
}
