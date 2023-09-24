import { SignalRenderContextCommunicator } from "../render-context/signal-render-context-communicator";


export function onUnmount(fn: () => void) {
    const currentContext = SignalRenderContextCommunicator.instance.currentContext;
    if(!currentContext) {
        throw 'No context found while registering onUnmount hook';
    }
    if(fn && typeof fn === 'function') {
        currentContext.lifeCycle.onUnmount = fn;
    }
}