
import { IComponentContainer } from "src.functional/lib/models/i-component-container";
import { RenderContext } from "./render-context";
import { renderContextMemoryMap } from "./../global-storage";

class RenderSignalContext {
    private _currentContext: RenderContext | null = null;

    protected constructor () {}
    get currentContext() {
        return this._currentContext;
    }

    accessCurrentContext(): RenderContext | null {
        return this._currentContext;
    }

    signalContext(componentKey: string, componentContainerRef: IComponentContainer) {
        let context: RenderContext;
        if(renderContextMemoryMap.has(componentKey)) {
            context = renderContextMemoryMap.get(componentKey) as RenderContext;
        } else {
            context = new RenderContext(componentContainerRef, componentKey);
            renderContextMemoryMap.set(componentKey, context);
        }
        this._currentContext = context;
    }
    
    removeContext() {
        this._currentContext.resetProjectState()
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




