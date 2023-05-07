import { Signal } from "../models";
import { SignalRenderContextCommunicator } from "../render-context/signal-render-context-communicator";

export const createEffect = <T>(fn: () => T, deps: Signal[] = []) => {
    const currentContext = SignalRenderContextCommunicator.instance.currentContext;
    // if (!currentContext) {
    //     throw new Error('createEffect must be called inside a signal component');
    // }
    // const effect = {
    //     fn,
    //     deps,
    // };
    // effectIdsMemorySet.add(effect.id);
    // return effect;
}