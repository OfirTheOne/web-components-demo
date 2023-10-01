
const globalDom = window.document;

export const access = {
    getElementById(id: string): HTMLElement | null {
        return access.getGlobalDocument().getElementById(id);
    },
    getGlobalDocument(): Document {
        return globalDom;
    },
};
