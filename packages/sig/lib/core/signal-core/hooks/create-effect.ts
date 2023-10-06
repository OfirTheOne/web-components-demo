import { Trackable } from "@sigjs/signal";
import { SignalRenderContextCommunicator } from "../render-context/signal-render-context-communicator";

export const createEffect = <T>(fn: () => T, deps: Trackable[] = []) => { 
    const currentContext = SignalRenderContextCommunicator.instance.currentContext;
    if (!currentContext) {
        throw new Error('createEffect must be called inside a component');
    }
    currentContext.registerEffect(fn, deps);
    fn();
}

