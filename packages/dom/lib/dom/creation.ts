import { Ctor, DomElement } from '../types';
import { SVG_TAGS, NAMESPACES } from "../constants/lang-spec";
import { access } from './access';


export const creation = {
    createTextNode(content?: string | number | boolean): Text {
        const nodeContent = (content === null || content === undefined) ? '' : String(content);
        return access.getGlobalDocument().createTextNode(nodeContent);
    },
    createElement<T extends DomElement = Element>(tag: string): T {
        return (SVG_TAGS.has(tag) ?
            access.getGlobalDocument().createElementNS(NAMESPACES.svg, tag) as SVGAElement :
            access.getGlobalDocument().createElement(tag)) as T;
    },
    defineCustomElement(tag: string, component: Ctor<any>, options?: ElementDefinitionOptions | undefined) {
        if (window.customElements) {
            window.customElements.define(tag, component, options);
        }
        return component;
    },
    buildShadow(elm: HTMLElement) {
        return elm.attachShadow({ mode: 'open' });
    }
};
