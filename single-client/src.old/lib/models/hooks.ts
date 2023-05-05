
export interface OnConnected {
    /**
     * This lifecycle hook is triggered when the element is removed from the DOM and is the ideal place to add 
     * cleanup logic (the code that needs to be executed before the element is destroyed) and to free up resources.
     */
    connectedCallback(): void
}
export interface OnDisconnected {
    disconnectedCallback(): void
}
export interface OnAttributeChanged {
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void
}
export interface OnAdopted {
    adoptedCallback(): void
}

export interface OnPreRender {
    preRender(): void
}
export interface OnPostRender {
    postRender(): void;
}
