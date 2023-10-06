
export const events = {
    onRenderReady(callback: () => void): void {
        window.addEventListener('load', callback);
    }
}