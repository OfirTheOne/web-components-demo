import { DomElement } from "../types";
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
    addClass(elm: HTMLElement | SVGAElement | Element, className: string | string[]) {
        (Array.isArray(className) ? className : [className])
            .map(c => c.split(' '))
            .flat()
            .filter(Boolean)
            .forEach((c) => elm.classList
            .add(c));
    },
    removeClass(elm: HTMLElement | SVGAElement | Element, className: string | string[]) {
        (Array.isArray(className) ? className : [className])
            .map(c => c.split(' '))
            .flat()
            .filter(Boolean)
            .forEach((c) => elm.classList
            .remove(c));
    },
    replaceClass(elm: HTMLElement | SVGAElement | Element, oldClassName: string | string[], newClassName: string | string[]) {
        this.removeClass(elm, oldClassName);
        this.addClass(elm, newClassName);
    },
    addEventListener(elm: DomElement, eventName: string, listener: EventListener) {
        if (elm && typeof listener === 'function') {
            elm.addEventListener(eventName, listener);
        }
    },
    removeEventListener(elm: DomElement, eventName: string, listener: EventListener) {
        if (elm && typeof listener === 'function') {
            elm.removeEventListener(eventName, listener);
        }
    }
};
