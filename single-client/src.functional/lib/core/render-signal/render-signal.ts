
import { IComponentContainer } from "src.functional/lib/models/i-component-container";
import { RenderContext } from "../../models/render-context";
import { StateChangesQueue } from "../render-task-agent/state-change-queue";
import { renderContextMemoryMap } from "./../global-storage";

class RenderSignalContext {


    private _currentContext: RenderContext | null = null;
    private _hookCounter: number = 0;

    protected constructor () {}
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

    accessCurrentContext() {
        return this._currentContext;
    }

    signalContext(componentKey: string, componentContainerRef: IComponentContainer) {
        let context: RenderContext;
        if(renderContextMemoryMap.has(componentKey)) {
            context = renderContextMemoryMap.get(componentKey);
        } else {
            context =  {
                componentContainerRef,
                stateChangesQueue: new StateChangesQueue(),
                projectedState: null,
                stateHolder: [],
                key: componentKey,
                props: {}
            };
            renderContextMemoryMap.set(componentKey, context);
        }
        this._currentContext = context;
    }
    
    removeContext() {
        this._hookCounter = 0;
        this._currentContext = null;
    }

    deleteStoredContext(componentKey: string) {
        return renderContextMemoryMap.delete(componentKey);
    }
}


export class RenderSignal extends RenderSignalContext {
    protected constructor() {
        super();
    }
    private static _instance: RenderSignalContext;

    static get instance() {
        if(!RenderSignal._instance) {
            RenderSignal._instance = new RenderSignalContext();
        }
        return RenderSignal._instance;
    }
}




