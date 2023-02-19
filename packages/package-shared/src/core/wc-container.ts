
import { IPresentable } from "../models/i-presentable";
import { WCContainerOptions } from "../models/wc-container-options";
import { StateProxy } from "./state-proxy";


const defaultWCContainerOptions: WCContainerOptions = {
    renderOnce: false,
};

export class WCContainer<S = any> extends HTMLElement {

    protected readonly _host: HTMLElement;
    protected readonly _shadow: ShadowRoot;
    protected readonly styleElement: HTMLStyleElement;
    protected container: HTMLElement;
    protected _presentable: IPresentable;
    protected _props: Record<string, any>;
    protected readonly _state: Record<string, any>;
    protected readonly _stateProxy: Record<string, any>;
    protected _children: any;

    public get host(): HTMLElement {
        return this._host;
    }
    private get isRenderOnce() {
        return this.container !== undefined;
    }

    constructor(protected readonly options: WCContainerOptions = defaultWCContainerOptions) {
        super();
        this._host = this;
        this.styleElement = document.createElement('style');
        this._shadow = this.buildShadow();
        this._state = {};
        this._stateProxy = StateProxy.create(this._state);
    }


    public readonly setStateCallQueue: Function[] = []

    connectedCallback(...args: []) {
        if(this._presentable['connectedCallback']) {
            <Function>this._presentable['connectedCallback'](...args);
        }
    };
    disconnectedCallback(...args: []) {
        if(this._presentable['disconnectedCallback']) {
            <Function>this._presentable['disconnectedCallback'](...args);
        }
    };
    attributeChangedCallback(...args: []) {
        if(this._presentable['attributeChangedCallback']) {
            <Function>this._presentable['attributeChangedCallback'](...args);
        }
    };
    adoptedCallback(...args: []) {
        if(this._presentable['adoptedCallback']) {
            <Function>this._presentable['adoptedCallback'](...args);
        }
    };

    public render(): WCContainer {
        if (this.canRender() && this.shouldRender()) {
            console.log('in render')
            this.preCoreRender();
            this.coreRender()
        }
        return this;
    }
    private canRender(): boolean {
        if (this._shadow && this._presentable && this.styleElement) {
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
        if (this.container) {
            this._shadow.removeChild(this.container);
        }
        this._shadow.childNodes.forEach(node => this._shadow.removeChild(node));
    }
    private coreRender(): void {
        this.styleElement.textContent = this._presentable.buildStyle(this._props);
        this.appendToShadow(this.styleElement);
        this.container = this.buildContainer(this._presentable.buildTemplate(this._props, this._children));
        this.appendToShadow(this.container);
    }

    public setPresentable(p: IPresentable): WCContainer {
        this._presentable = p;
        this.connectState();
        return this;
    }
    public setProps(props: any = {}): WCContainer {
        this._props = props;
        return this;
    }
    public setChildren(children: any[] = []): WCContainer {
        this._children = children;
        return this;
    }

    protected readonly registeredRenderTimers = new Set<NodeJS.Timeout>();

    protected setState(assignedState: Record<string, any> | ((cur: Record<string, any>) => Record<string, any>)): any {
        const actualAssignedState =
            typeof assignedState === 'function' ? 
                assignedState(this._stateProxy) : assignedState;
        if(actualAssignedState !== this._stateProxy) {
            this.setStateCallQueue.push(
                () => Object
                    .keys(actualAssignedState)
                    .forEach(key => this._state[key] = actualAssignedState[key])
            );
        }
        const timer = setTimeout(() => {
            this.registeredRenderTimers.delete(timer);
            this.registeredRenderTimers.forEach(registeredTimer => clearTimeout(registeredTimer));
            this.registeredRenderTimers.clear();
            this.setStateCallQueue.forEach(change => change());
            this.setStateCallQueue.length = 0;
            this.render();
        }, 0);
        this.registeredRenderTimers.add(timer)

    }
    protected connectState() {
        this._presentable['state'] = this._stateProxy;
        this._presentable['setState'] = this.setState.bind(this);
    }
    protected buildShadow() {
        return this._host.attachShadow({ mode: 'open' });
    }
    protected buildContainer(containerElementOrTag: keyof HTMLElementTagNameMap | HTMLElement) {
        const container = typeof containerElementOrTag == 'string' ?
            document.createElement(containerElementOrTag) : containerElementOrTag;
        return container;
    }
    protected appendToShadow(elem: HTMLElement): void {
        this._shadow.appendChild(elem);
    }
}
