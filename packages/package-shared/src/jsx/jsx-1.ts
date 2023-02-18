

import { BaseWebComponent } from "./../utils/base-web-component";
type CapitalEventName = `on${Capitalize<keyof HTMLElementEventMap>}`;

function isCapitalEventName(evName: string): evName is CapitalEventName {
    return evName.startsWith("on") && evName.toLowerCase() in window;
}   

function isBaseWebComponent(maybeWc: Function): maybeWc is CustomElementConstructor {
    return maybeWc.prototype instanceof BaseWebComponent;
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
        } else {
            return tag(props, ...children);
        }
    } else if(typeof tag === "string") {
        element = document.createElement(tag);
        const nonEmptyProps = props||{};
        const styleProp = nonEmptyProps['style'];
        const propsEntries = Object.entries(nonEmptyProps).filter(([key, _val]) => key !== 'style');

        if(styleProp) {
            const validStyleEntries = Object
                .entries(styleProp)
                .map(([name, value]) => {  
                    const validStyleAttr = !name.includes('-') ? name :
                        name.replace(/(?:^\w|[A-Z]|\b-\w)/g, (match, i) => 
                            i == 0 ? 
                                match.toLocaleLowerCase() : 
                                    match[0] == '-' ? 
                                        match.toLocaleUpperCase() : 
                                        '-' + match.toLocaleUpperCase()
                        );
                    return [validStyleAttr, value]
                });
            element.setAttribute('style', validStyleEntries.join(';'));
        }

        propsEntries.forEach(([name, value]) => {    
            if (isCapitalEventName(name)) {
                const eventName = name.toLowerCase().substring(2) as keyof HTMLElementEventMap;
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(name, value.toString());
            }
        });
    }

    children.forEach(child => {
        appendChild(element, child);
    });
    return element;
};

const appendChild = (parent: HTMLElement, child: string | HTMLElement) => {
    if (Array.isArray(child)) {
        child.forEach(nestedChild => appendChild(parent, nestedChild));
    } else {
        parent.appendChild(typeof child !== 'string' ?
            child :
            document.createTextNode(child) 
        );
    }
};


const applyElementStyle = () => {
    
}

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