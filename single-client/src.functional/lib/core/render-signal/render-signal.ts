
import { RenderContext } from "../../models/render-context";
import { stateMemoryMap } from "./../global-storage";

class RenderSignalContext {

    private _currentContext: RenderContext | null = null;

    get currentContext() {
        return this._currentContext;
    }

    signalContext(componentKey: string) {
        let context: RenderContext;
        if(stateMemoryMap.has(componentKey)) {
            context = stateMemoryMap.get(componentKey);
        } else {
            context =  {
                state: {},
                key: componentKey,
                props: {}
            };
            stateMemoryMap.set(componentKey, context);
        }
        this._currentContext = context;
    }
    
    removeContext() {
        this._currentContext = null;
    }

    deleteStoredContext(componentKey: string) {
        return stateMemoryMap.delete(componentKey);
    }
}



export const RenderSignal = new RenderSignalContext();