import { SignalRenderContextCommunicator } from "../render-context/signal-render-context-communicator";


export function onDispose(fn: () => void) {
    const currentContext = SignalRenderContextCommunicator.instance.currentContext;
    if(!currentContext) {
        throw '';
    }
    if(fn && typeof fn === 'function') {
        currentContext.registeredHooks.onDispose = fn;
    }
}