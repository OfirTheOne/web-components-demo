

export function attachShadowDom(
    component: HTMLElement,
    container: HTMLElement,
    style: HTMLStyleElement
): ShadowRoot {
    const shadow = component.attachShadow({mode: 'open'});
    shadow.appendChild(style);
    shadow.appendChild(container);
    return shadow;
}