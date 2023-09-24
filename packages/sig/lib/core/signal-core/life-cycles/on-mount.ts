import { SignalRenderContextCommunicator } from "../render-context/signal-render-context-communicator";



export function onMount(fn: () => void) {
    const currentContext = SignalRenderContextCommunicator.instance.currentContext;
    if(!currentContext) {
        throw '';
    }
    if(fn && typeof fn === 'function') {
        currentContext.lifeCycle.onMount = fn;
    }
}