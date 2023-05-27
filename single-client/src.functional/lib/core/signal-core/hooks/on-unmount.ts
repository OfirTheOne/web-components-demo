import { SignalRenderContextCommunicator } from "../render-context/signal-render-context-communicator";


export function onUnmount(fn: () => void) {
    const currentContext = SignalRenderContextCommunicator.instance.currentContext;
    if(!currentContext) {
        throw '';
    }
    if(fn && typeof fn === 'function') {
        currentContext.registeredHooks.onUnmount = fn;
    }
}