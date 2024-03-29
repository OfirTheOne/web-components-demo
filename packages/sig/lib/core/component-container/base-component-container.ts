
import { Props, VirtualElement, VirtualFnComponent, VirtualRender } from "@/models";
import { IComponentContainer } from "@/models/i-component-container";
import { OneOrMany } from "@/types";
import { ComponentKeyBuilder } from "@/common/component-key-builder";
import { DOM } from "@sigjs/dom";

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
    // abstract onUnmount(): void;
    // abstract onDispose(): void;

    public connectOnMount(domElement: OneOrMany<HTMLElement>) {
        DOM.treeManipulation.appendToParent(this._parent, domElement);
    }
    public connectOnSelfRerender(domElement: OneOrMany<HTMLElement>) {
        DOM.treeManipulation.replace(this._parent, this._container, domElement);
    }

    protected coreRender(vElem: OneOrMany<VirtualElement>, overrideKey?: string): OneOrMany<HTMLElement> {
        const usedKey = overrideKey || this._key;
        return Array.isArray(vElem) ? 
            vElem.map((el, i) => <HTMLElement>this.internalRender(
                this._parent, 
                el, 
                ComponentKeyBuilder.build(usedKey).idx(i).toString()
            )) : 
            <HTMLElement>this.internalRender(this._parent, vElem, usedKey);
    }
}