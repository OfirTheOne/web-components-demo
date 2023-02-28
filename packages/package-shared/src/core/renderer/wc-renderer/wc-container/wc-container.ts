
import { InternalRender } from "../../../../models/internal-render";
import { VirtualElement } from "../../../../models/virtual-element";
import { IPresentable } from "../../../../models/i-presentable";
import { RenderTaskAgent } from "./render-task-agent";
import { StateChangesQueue } from "./state-change-queue";
import { StateProxy } from "./state-proxy";
import { WCContainerOptions } from "shared/utils";


const defaultWCContainerOptions: WCContainerOptions = {
    renderOnce: false,
    noWrap: false
};

export class WCContainer extends HTMLElement {

    protected readonly _host: HTMLElement;
    protected readonly _shadow: ShadowRoot;
    protected readonly _styleElement: HTMLStyleElement;
    protected container: HTMLElement | HTMLElement[];

    protected readonly _state: Record<string, any>;
    protected readonly _stateProxy: Record<string, any>;
    protected readonly _renderTaskAgent: RenderTaskAgent;
    protected readonly _stateChangesQueue: StateChangesQueue;

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
    ) {
        super();
        this._host = this;
        this._styleElement = document.createElement('style');
        this._shadow = this.buildShadow();
        this._state = {};
        this._stateProxy = StateProxy.create(this._state);
        this._stateChangesQueue = new StateChangesQueue();
        this._renderTaskAgent = new RenderTaskAgent(this,
            () => { 
                this._stateChangesQueue.runChanges(); 
                this._stateChangesQueue.clear(); 
            }
        );
        this.connectState();
    }

    connectedCallback(...args: unknown[]) {
        if (typeof this.presentable?.['connectedCallback'] === 'function') {
            <Function>this.presentable['connectedCallback'](...args);
        }
    };
    disconnectedCallback(...args: unknown[]) {
        if (typeof this.presentable?.['disconnectedCallback'] === 'function') {
            <Function>this.presentable['disconnectedCallback'](...args);
        }
    };
    attributeChangedCallback(...args: unknown[]) {
        if (typeof this.presentable?.['attributeChangedCallback'] === 'function') {
            <Function>this.presentable['attributeChangedCallback'](...args);
        }
    };
    adoptedCallback(...args: unknown[]) {
        if (typeof this.presentable?.['adoptedCallback'] === 'function') {
            <Function>this.presentable['adoptedCallback'](...args);
        }
    };

    public render(): WCContainer | HTMLElement {
        if (this.canRender() && this.shouldRender()) {
            this.preCoreRender();
            const wasRendered = this.coreRender();
            this.postCoreRender();
            if(!wasRendered) {
                return null
            }
        }
        return this;
    }
    private canRender(): boolean {
        if (this._shadow && this.presentable && this._styleElement) {
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
        if(typeof this.presentable['preRender'] === 'function') {
            this.presentable['preRender']();
        }
        // if (this.container) {
        //     this._shadow.removeChild(this.container);
        // }
        // this._shadow.childNodes.forEach(node => this._shadow.removeChild(node));
    }
    private coreRender(): boolean {
        this._styleElement.textContent = this.presentable.buildStyle(this.props);
        this.appendToShadow(this._styleElement);
        const virtualElement = this.presentable.buildTemplate(this.props, this._children) as unknown as VirtualElement;
        if(virtualElement == null) {
            return false
        } else {
            const element = this._render(virtualElement);

            if(this.container) {
                if(Array.isArray(this.container)) {
                    this.container.forEach(node =>node.remove());
                } else {
                    this.container.remove();
                }
            } 
            this.container = element
            this.appendToShadow(this.container); 
        
            return !!element;
        }
    }
    private postCoreRender(): void {
        if(typeof this.presentable['postRender'] === 'function') {
            this.presentable['postRender']();
        }
    }
    protected setState(assignedState: Record<string, any> | ((cur: Record<string, any>) => Record<string, any>)): any {
        const actualAssignedState = typeof assignedState === 'function' ? assignedState(this._stateProxy) : assignedState;
        if (actualAssignedState !== this._stateProxy) {
            this._stateChangesQueue.pushStateChange(this._state, actualAssignedState);
        }
        this._renderTaskAgent.registerRender();
    }

    protected connectState() {
        this.presentable['state'] = this._stateProxy;
        this.presentable['setState'] = this.setState.bind(this);
    }
    protected buildShadow() {
        return this._host.attachShadow({ mode: 'open' });
    }
    protected buildContainer(containerElementOrTag: keyof HTMLElementTagNameMap | HTMLElement) {
        const container = typeof containerElementOrTag == 'string' ?
            document.createElement(containerElementOrTag) : containerElementOrTag;
        return container;
    }
    protected appendToShadow(elem: HTMLElement | HTMLElement[]): void {
        Array.isArray(elem) ? 
            elem.forEach(node => this._shadow.appendChild(node)) :
            this._shadow.appendChild(elem);
    }
}
