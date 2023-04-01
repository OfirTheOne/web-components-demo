
import { RenderContext } from "../../models/render-context";
import { stateMemoryMap } from "./../global-storage";

class RenderSignalContext {

    private _currentContext: RenderContext | null = null;
    private _hookCounter: number = 0;

    get currentContext() {
        this._hookCounter = this._hookCounter + 1;
        if(this._currentContext.stateHolder.length < this._hookCounter) {
            this._currentContext.stateHolder.push({
                value: null,
                initialized: false
            });    
        }
        this._currentContext.projectedState = this._currentContext.stateHolder[this._hookCounter] || null;

        return this._currentContext;
    }


    signalContext(componentKey: string) {
        let context: RenderContext;
        if(stateMemoryMap.has(componentKey)) {
            context = stateMemoryMap.get(componentKey);
        } else {
            context =  {
                projectedState: null,
                stateHolder: [],
                key: componentKey,
                props: {}
            };
            stateMemoryMap.set(componentKey, context);
        }
        this._currentContext = context;
    }
    
    removeContext() {
        this._hookCounter = 0;
        this._currentContext = null;
    }

    deleteStoredContext(componentKey: string) {
        return stateMemoryMap.delete(componentKey);
    }
}



export const RenderSignal = new RenderSignalContext();