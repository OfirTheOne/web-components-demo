import { Signal, Trackable } from "../models";
import { SignalRenderContextCommunicator } from "../render-context/signal-render-context-communicator";

export const createEffect = <T>(fn: () => T, deps: Trackable[] = []) => {
    
    
    const effect = {
        fn,
        deps,
    };

    const signals: Signal[] = removeDuplicationWithOrder(deps.map(dep => 'source' in dep ? dep.source : dep));
    signals.forEach(signal => {
        const emitter = signal.emitter;
        emitter.on('change', () => {
            fn();
        });
    });
    fn();
}


const removeDuplicationWithOrder = <T>(list: T[]): T[] => {
    const map = new Map<T, boolean>();
    const result: T[] = [];
    list.forEach(item => {
        if (!map.has(item)) {
            map.set(item, true);
            result.push(item);
        }
    });
    return result;

}