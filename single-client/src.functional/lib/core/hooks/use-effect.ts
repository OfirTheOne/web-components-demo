import { HookType, HookSlot } from "../../models/i-render-context";
import { RenderSignal } from "../render-signal/render-signal";



interface EffectHookSlot extends HookSlot {
    value: () => void;
    dependencies: any[]
    initialized: boolean;
}

export function useEffect(callback: () => void, dependencies: any[]) {
    RenderSignal.instance.currentContext.declareHook(HookType.useEffect);
    const hookPositionInContext = RenderSignal.instance.currentContext.hookCounter-1;
    const currentContext = RenderSignal.instance.currentContext;
    const projectedState = currentContext.projectState<EffectHookSlot>(hookPositionInContext);
    const isFirstRender = !projectedState.initialized;
    if(isFirstRender) {
        projectedState.value = callback;
        projectedState.dependencies = dependencies;
        projectedState.initialized = true;
    } else if(isDependenciesChanged(projectedState.dependencies, dependencies)) {
        projectedState.value = callback;
        projectedState.dependencies = dependencies;
        
    
    }

    

    if(!dependencies) {
        currentContext.stateChangesQueue.push(() => {
            projectedState.value();
        });
        currentContext.renderTaskAgent.registerTask();
    }

}



function isDependenciesChanged(oldDependencies: any[], newDependencies: any[]) {
    if(oldDependencies.length !== newDependencies.length) {
        return true;
    }
    for(let i = 0; i < oldDependencies.length; i++) {
        if(oldDependencies[i] !== newDependencies[i]) {
            return true;
        }
    }
    return false;
}