import { DOMUtils } from "../utils/dom-utils";
import { InternalRender } from "../types";
import { RenderSignal } from "../render-signal/render-signal";

export class ComponentContainer {

    protected container: HTMLElement | HTMLElement[];
    constructor(
        protected fnComponent: Function, 
        protected props: Record<string, any>, 
        protected children: any[],
        protected key: string,
        
        protected parent: any, 
        protected style: any, 
        protected options: Record<string, any>,
        protected internalRender: InternalRender,
    ) {

    }

    public get wasRenderedBefore() {
        return this.container !== undefined;
    }

    render() {
        RenderSignal.signalContext(this.key);
        const virtualElement = this.fnComponent(this.props, this.children);
        RenderSignal.removeContext();
        if (virtualElement == null) {
            return undefined;
        }
        const domElement = this.internalRender(virtualElement, this.parent);
        if (this.parent) {
            if (!this.wasRenderedBefore) {
              DOMUtils.appendToParent(this.parent, <HTMLElement>domElement);
              this.container = <HTMLElement>domElement;
            } else {
              const firstContainerNode = Array.isArray(this.container)
                ? this.container[0]
                : this.container;
              const renderStartPointNode = (
                DOMUtils.isOnlyChild(firstContainerNode)
                  ? null
                  : firstContainerNode.previousSibling
              ) as HTMLElement | null;
              DOMUtils.removeSelf(this.container);
              DOMUtils.insertChildAfterNode(
                this.parent,
                domElement,
                renderStartPointNode
              );
              this.container = <HTMLElement>domElement;
            }
          }
        return domElement;
    }
}