/*
import { SignalRenderContextCommunicator } from '../../../render-context/signal-render-context-communicator';
import { RoutesProps } from './routes.control';
import { BaseControlFlowComponentContainer } from '../../../component-container/base-dynamic-template-component-container';
import { ComponentKeyBuilder } from '../../../../component-key-builder';
import { defineComponent } from '../../../../utils/define-component';
import { Route, router } from '../../../../../common/router';
import { VirtualElement, FC } from '../../../../../models';
import { OneOrMany } from '../../../../../types/utils';
import { ControlFlow } from '../../../models';
import { RouteProps } from '../route/route.control';

const TAG_NAME = 'routes-control'
defineComponent(
    TAG_NAME,
    class extends HTMLElement {},
);

const createPlaceholder = (key: string) => {
   const ph = document.createElement(TAG_NAME);
   ph.setAttribute('role', 'ph');
   ph.setAttribute('for', key);
   ph.style.display = 'none';
   ph.style.visibility = 'hidden';
   return ph;
}

export class x extends BaseControlFlowComponentContainer {
    // domElementMemo: HTMLElement[] = [];
    renderRunBefore = false;
    routes: { 
        vElement: VirtualElement,
        routeListener: Route, 
        domElementMemo: HTMLElement 
    }[] = [];
    readonly placeholder = createPlaceholder(this.key);

    render(): OneOrMany<HTMLElement> {
        let domElement: OneOrMany<HTMLElement> = this.placeholder;
        const childrenRoute = this.filterChildrenRoute(this._children);
        if(childrenRoute.length > 0) {
            childrenRoute.map(childRoute => {
                const routeProps = childRoute.props as RouteProps;
                const route = new Route(routeProps.path, 
                    (location, params, state) => {
                        domElement = this.resolveRenderedOutput(location, params, state);
                        this._container = domElement;
                    },
                    () => {
                        // domElement = this.resolveRenderedOutput(location, params, state);
                        if(this._container !== this.placeholder) {
                            this.connectOnSelfRerender(this.placeholder);
                            this._container = this.placeholder;
                        }
                    }
                );
                this.routes.push({
                    vElement: childRoute,
                    routeListener: route,
                    domElementMemo: null    
                });
            });

        }
    
        this.renderRunBefore = true;
        domElement = this.placeholder;
        this._container = domElement;
        return domElement;   
        
    }

    resolveRenderedOutput(location: string, params: Record<string, string>, state: unknown): OneOrMany<HTMLElement> | null {
        SignalRenderContextCommunicator.instance.setContext(this.key, this);              
        let domElement: OneOrMany<HTMLElement> = null;
        const routeProps = this.props as RouteProps;
        const routeChildren = this._children as OneOrMany<VirtualElement> | [FC<{location: string, params: Record<string, string>, state: unknown}>]
        const componentFactory = (
            (typeof routeProps.component == 'function') ? routeProps.component : 
                (Array.isArray(routeChildren) && 
                    routeChildren.length === 1 && 
                    typeof routeChildren[0] === 'function') ? routeChildren[0] : undefined
        ) as FC | undefined;

        if(this.domElementMemo) {
            domElement = this.domElementMemo;
        } else if(routeChildren || routeProps.component) {
            let virtualContentElement: OneOrMany<VirtualElement>;
            if(componentFactory) {
                virtualContentElement = componentFactory({ location, params, state }, undefined) as unknown as VirtualElement;
            } else {
                virtualContentElement  = (routeChildren || routeProps.component) as unknown as VirtualElement ;
            }
            domElement = <HTMLElement>(
                Array.isArray(virtualContentElement)
                    ? virtualContentElement.map((v, i) => 
                        this.internalRender(
                            this._parent,
                            v, 
                            ComponentKeyBuilder.build(this.key).idx(i).toString()
                        )) : 
                        this.internalRender(this._parent, virtualContentElement, this.key)
            );
            this.domElementMemo = domElement;
        }
        SignalRenderContextCommunicator.instance.removeContext();
        if((Array.isArray(domElement) && domElement.length == 0) || !domElement) {
            domElement = this.placeholder;
        }
        if (this._parent) {
            if (this.wasRenderedBefore) {
                this.connectOnSelfRerender(domElement);
            } else {
                this.connectOnMount(domElement);
            }
        }
        return domElement;
    }

    filterChildrenRoute(maybeChildrenRoute: VirtualElement[]) {
        const routeChildren = maybeChildrenRoute;
        return routeChildren.filter(v => 
            (v.tag['$$control-flow'] == Symbol.for(ControlFlow.Route)) && 
            (v.props as Record<string, string>).path !== undefined
        );
    }

}

*/