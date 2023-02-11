

type CapitalEventName = `on${Capitalize<keyof HTMLElementEventMap>}`;

function isCapitalEventName(evName: string): evName is CapitalEventName {
    return evName.startsWith("on") && evName.toLowerCase() in window;
}   

type Props 
    = Record<CapitalEventName, (ev: Event) => void> 
    | Record<string, boolean|number|string>;


export const createElement = (
    tag: string | Function, 
    props: Props, 
    ...children: Array<HTMLElement|string>) => {
    if (typeof tag === "function") return tag(props, ...children);
    const element = document.createElement(tag);

    Object.entries(props||{}).forEach(([name, value]) => {        
        if (isCapitalEventName(name)) {
            const eventName = name.toLowerCase().substring(2) as keyof HTMLElementEventMap;
            element.addEventListener(eventName, value);
        }
        else element.setAttribute(name, value.toString());
    });

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