
import { Presentable } from "../../presentable";
import { WCContainer } from "./wc-container/wc-container";
import { getDefineComponentArg } from "../../../decorators/accessors";
import { Props } from "../../../models/props";
import { defineComponent } from "../../../utils/define-component";
import { VirtualElement } from "../../../models/virtual-element";
import { InternalRender } from "../../../models/internal-render";

export function render(vElem: VirtualElement, id: string) {
    const element = virtualRender(vElem.tag, vElem.props, vElem.children);
    Array.isArray(element) ? 
        element.forEach(node => document.getElementById(id).appendChild(node)) :
        document.getElementById(id).appendChild(element);

}

export const internalRender: InternalRender = (vElem): (HTMLElement | HTMLElement[]) => {
    return virtualRender(vElem.tag, vElem.props, vElem.children);
}

type Ctor<T> = new (...args: any[]) => T;

type CapitalEventName = `on${Capitalize<keyof HTMLElementEventMap>}`;


export const virtualRender = (
    tag: string | Function, 
    props: Props = {}, 
    children: Array<string | VirtualElement>
): HTMLElement | HTMLElement[] => {
    let element: HTMLElement | HTMLElement[]; 
    if (typeof tag === "function" && isPresentable(tag)) {
        element = handlePresentableElement(tag, props, children);
    } else if(typeof tag === "string") {
        element = handleNativeTagElement(tag, props, children);
    }
    return element;
};

const handlePresentableElement = ( 
    tag: Ctor<Presentable<any>>, 
    props: Props, 
    children: Array<string | VirtualElement>
): HTMLElement | HTMLElement[] => {
    const args = getDefineComponentArg(tag);
    if(args) {
        const { name, options } = args;
        if(customElements.get(name) == undefined) {
            defineComponent(name, class extends WCContainer {}, options);
        }
        const WccCtor = customElements.get(name) as Ctor<WCContainer>;
        const wcc = new WccCtor(
                options,
                new tag(),
                props,
                children,
                internalRender
            )
            
        return wcc.render();
    } else {
        throw new Error("Presentable component must be decorated with @DefineComponent.");   
    }
}

const handleNativeTagElement = (
    tag: string, 
    props: Props, 
    children: Array<VirtualElement|string>
) => {

    const element = document.createElement(tag);
    if(props) {
        const nonEmptyProps = props;
        const styleProp = nonEmptyProps['style'];
        const propsEntries = Object.entries(nonEmptyProps).filter(([key, _val]) => key !== 'style');
        const mutatedPropsEntries = handleAttributeMutation(propsEntries);
        if(styleProp && typeof styleProp == 'object') {
            element.setAttribute('style', convertStyleObjectToInlineStyle(<Record<string, unknown>>styleProp));
        }
        mutatedPropsEntries.forEach(([name, value]) => {    
            if (isCapitalEventName(name)) {
                const eventName = name.toLowerCase().substring(2) as keyof HTMLElementEventMap;
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(name, value.toString());
            }
        });
    }
    if(children.length > 0) {
        children
            .filter(child => child !== undefined && child !== null)
            .map(child => typeof child === 'string' ? child : internalRender(child))
            .forEach(child => appendChild(element, child));
    }
    return element;
}

const handleAttributeMutation = (propsEntries: [string, any][]) => {
    const classnameIndex =  propsEntries.findIndex(([key, value]) => key.toLocaleLowerCase() === 'classname');
    if(classnameIndex > -1) {
        propsEntries[classnameIndex] = ['class', propsEntries[classnameIndex][1]];
        if(propsEntries[classnameIndex][1].includes('TabContent tab2')) {
            console.log("herrerere");
        }
    }
    return propsEntries; 
}

const convertStyleObjectToInlineStyle = (styleObject: Record<string, unknown>): string => {
    const validStyleEntries = Object
    .entries(styleObject)
    .map(([name, value]) => {  
        const validStyleAttr = !name.includes('-') ? name :
            name.replace(/(?:^\w|[A-Z]|\b-\w)/g, (match, i) => 
                i == 0 ? 
                    match.toLocaleLowerCase() : 
                        match[0] == '-' ? 
                            match.toLocaleUpperCase() : 
                            '-' + match.toLocaleUpperCase()
            );
        return [validStyleAttr, value];
    });
    return validStyleEntries
        .map(([key, value]) => `${key}: ${value}`)
        .join(';');
}

const appendChild = (parent: HTMLElement, child: string | HTMLElement | (string | HTMLElement)[]) => {
    if(child) {
        if (Array.isArray(child)) {
            child.forEach(nestedChild => appendChild(parent, nestedChild));
        } else {
            parent.appendChild(typeof child !== 'string' ?
                child : document.createTextNode(child) 
            );
        }
    }
};

function isCapitalEventName(evName: string): evName is CapitalEventName {
    return evName.startsWith("on") && evName.toLowerCase() in window;
}   

function isPresentable(maybePresentable: Function): maybePresentable is Ctor<Presentable> {
    return maybePresentable.prototype instanceof Presentable;
}

