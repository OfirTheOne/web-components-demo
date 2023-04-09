
import { inheritableContextMemoryMap } from "../global-storage";
import { toSingleton } from "../utils/to-singleton";
import { InheritableContext } from "./inheritable-context";



export class InheritableContextRegistry extends InheritableContext {

  getContextValue(key: string): any {
    if(inheritableContextMemoryMap.has(key)) {
      const context = inheritableContextMemoryMap.get(key);
      return context.value;
    }
    return null;
  }

  registerContext(key: string, context: InheritableContext) {
    if(inheritableContextMemoryMap.has(key)) {
      throw new Error(`InheritedContextRepo: Context with key ${key} already exists.`);
    }
    inheritableContextMemoryMap.set(key, context);
  }

  getContext(key: string): Record<string, any> | null {
    if(inheritableContextMemoryMap.has(key)) {
      return inheritableContextMemoryMap.get(key) as Record<string, any>;
    }
    return null;
  }
}

export const InheritableContextManager = toSingleton(InheritableContextRegistry);
