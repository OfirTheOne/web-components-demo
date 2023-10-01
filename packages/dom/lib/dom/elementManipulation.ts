import { NAMESPACES } from "../constants/lang-spec";

export const elementManipulation = {
    setAttribute(elm: HTMLElement | SVGAElement | Element, attribute: string, value: string) {
        if (elm instanceof SVGAElement) {
            const [nsPrefix, ..._rest] = attribute.split(':');
            const ns = NAMESPACES[nsPrefix] || NAMESPACES.svg;
            elm.setAttributeNS(ns, attribute, value);
        } else {
            elm.setAttribute(attribute, value);
        }
    },
    removeAttribute(elm: HTMLElement | SVGAElement | Element, attribute: string) {
        if (elm instanceof SVGAElement) {
            const [nsPrefix, ..._rest] = attribute.split(':');
            const ns = NAMESPACES[nsPrefix] || NAMESPACES.svg;
            elm.removeAttributeNS(ns, attribute);
        } else {
            elm.removeAttribute(attribute);
        }
    },
    addClass(elm: HTMLElement | SVGAElement | Element, className: string) {
        className.split(' ').forEach((c) => elm.classList.add(c));
    },
    removeClass(elm: HTMLElement | SVGAElement | Element, className: string) {
        className.split(' ').forEach((c) => elm.classList.remove(c));
    },
    replaceClass(elm: HTMLElement | SVGAElement | Element, oldClassName: string, newClassName: string) {
        this.removeClass(elm, oldClassName);
        this.addClass(elm, newClassName);
    },
    addEventListener(elm: HTMLElement | Element, eventName: string, listener: EventListener) {
        if (elm && typeof listener === 'function') {
            elm.addEventListener(eventName, listener);
        }
    },
    removeEventListener(elm: HTMLElement | Element, eventName: string, listener: EventListener) {
        if (elm && typeof listener === 'function') {
            elm.removeEventListener(eventName, listener);
        }
    }
};
