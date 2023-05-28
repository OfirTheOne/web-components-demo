
import { Props, VirtualElement } from "../../models";
import { IComponentContainer } from "../../models/i-component-container";
import { VirtualFnComponent } from "../../models/virtual-fn-component";
import { OneOrMany } from "../../types/utils";
import { VirtualRender } from "../../models/virtual-render";
import { DOMUtils } from "../utils/dom-utils";
import { ComponentKeyBuilder } from "../component-key-builder";


export abstract class BaseComponentContainer implements IComponentContainer {
    protected _container: OneOrMany<HTMLElement>;

    constructor(
        protected fnComponent: VirtualFnComponent,
        protected _props: Props,
        protected _children: any[],
        protected _key: string,
        protected _parent: HTMLElement | null,
        protected style: any,
        protected options: Record<string, any>,
        public readonly  internalRender: VirtualRender
    ) { }


    setParent(parent: HTMLElement | null) {
        this._parent = parent;
        return this;
    }
    setProps(props: Props) {
        this._props = props;
        return this;
    }
    setChildren(children: any[]) {
        this._children = children;
        return this;
    }

    get component() {
        return this.fnComponent;
    }
    public get parent() {
        return this._parent;
    }
    public get children() {
        return this._children;
    }
    public get props() {
        return this._props;
    }
    public get key() {
        return this._key;
    }
    public get container() {
        return this._container;
    }
    public get wasRenderedBefore() {
        return this._container !== undefined;
    }

    abstract render(): OneOrMany<HTMLElement> | null;
    abstract onUnmount(): void;
    abstract onDispose(): void;

    public connectOnMount(domElement: OneOrMany<HTMLElement>) {
        DOMUtils.appendToParent(this._parent, domElement);
    }
    public connectOnSelfRerender(domElement: OneOrMany<HTMLElement>) {
        DOMUtils.replace(this._parent, this._container, domElement);
    }

    protected coreRender(vElem: OneOrMany<VirtualElement>): OneOrMany<HTMLElement> {
        return Array.isArray(vElem) ? 
            vElem.map((el, i) => <HTMLElement>this.internalRender(
                this._parent, 
                el, 
                ComponentKeyBuilder.build(this._key).idx(i).toString()
            )) : 
            <HTMLElement>this.internalRender(this._parent, vElem, this.key);
    }
}