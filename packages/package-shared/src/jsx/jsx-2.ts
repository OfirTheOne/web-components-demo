

type Ctor<T> = new (...args: any[]) => T;

import { BaseWebComponent } from "./../utils/base-web-component";
import { Presentable } from "./../core/presentable";
import { WCContainer } from "./../core/wc-container";
import { getDefineComponentArg } from "../decorators/accessors";
import { defineComponent } from "../utils";

type CapitalEventName = `on${Capitalize<keyof HTMLElementEventMap>}`;

function isCapitalEventName(evName: string): evName is CapitalEventName {
    return evName.startsWith("on") && evName.toLowerCase() in window;
}   


function isBaseWebComponent(maybeWc: Function): maybeWc is Ctor<BaseWebComponent>{
    return maybeWc.prototype instanceof BaseWebComponent;
}

function isPresentable(maybePresentable: Function): maybePresentable is Ctor<Presentable> {
    return maybePresentable.prototype instanceof Presentable;
}

type Props 
    = Record<CapitalEventName, (ev: Event) => void> 
    | Record<string, boolean|number|string>;


export const createElement = (
    tag: string | Function, 
    props: Props, 
    ...children: Array<HTMLElement|string>
): HTMLElement => {
    let element: HTMLElement; 
    if (typeof tag === "function") {
        if(isBaseWebComponent(tag)) {
            element = new tag(props);
        } else if(isPresentable(tag)) {
            element = handlePresentableElement(tag, props, children);
        }
    } else if(typeof tag === "string") {
        element = handleNativeTagElement(tag, props);
    }

    if(typeof tag !== "function" || !isPresentable(tag)) {
        children.forEach(child => {
            appendChild(element, child);
        });
    }
    return element;
};

const handlePresentableElement = ( 
    tag: Ctor<Presentable<any>>, 
    props: Props, 
    children: Array<HTMLElement|string>
) => {
    const args = getDefineComponentArg(tag);
    if(args) {
        const { name, options } = args;
        if(customElements.get(name) == undefined) {
            defineComponent(name, class extends WCContainer {}, options);
        }
        const WccCtor = customElements.get(name) as Ctor<WCContainer>;
        const wcc = new WccCtor(options)
            .setPresentable(new tag())
            .setProps(props)
            .setChildren(children)
            .render()
        return wcc.host;
    } else {
        throw new Error("Presentable component must be decorated with @DefineComponent.");   
    }
}

const handleNativeTagElement = (tag: string, props: Props) => {

    const element = document.createElement(tag);
    const nonEmptyProps = props||{};
    const styleProp = nonEmptyProps['style'];
    const propsEntries = Object.entries(nonEmptyProps).filter(([key, _val]) => key !== 'style');
    if(styleProp) {
        element.setAttribute('style', convertStyleObjectToInlineStyle(styleProp));
    }

    propsEntries.forEach(([name, value]) => {    
        if (isCapitalEventName(name)) {
            const eventName = name.toLowerCase().substring(2) as keyof HTMLElementEventMap;
            element.addEventListener(eventName, value);
        } else {
            element.setAttribute(name, value.toString());
        }
    });
    return element;
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
                .join(';')
}

const appendChild = (parent: HTMLElement, child: string | HTMLElement) => {
    if(child) {
        if (Array.isArray(child)) {
            child.forEach(nestedChild => appendChild(parent, nestedChild));
        } else {
            parent.appendChild(typeof child !== 'string' ?
                child :
                document.createTextNode(child) 
            );
        }
    }
};

export const createFragment = (_props:Props, ...children: Array<HTMLElement|string>) => {
    return children;
};

export const WC = {
    createElement,
    createFragment
};


export default {
    createElement,
    createFragment
};


