import { inheritableContextMemoryMap } from '../global-storage';
import { toSingleton } from '../utils/to-singleton';
import { InheritableContext } from './inheritable-context';

export class InheritableContextRegistry extends InheritableContext {
  getContextValue<V = any>(ctxSymbol: symbol, key: string): V {
    if (inheritableContextMemoryMap.has(ctxSymbol)) {
      return this.getClosestContext(ctxSymbol, key)?.value;
    }
    return null;
  }

  registerContext(ctxSymbol: symbol, context: InheritableContext) {
    if (inheritableContextMemoryMap.has(ctxSymbol)) {
      if (inheritableContextMemoryMap.get(ctxSymbol).find((c) => c.key === context.key)) {
        throw new Error(`InheritedContextRepo: Context with key ${context.key} already exists.`);
      }
    } else {
      inheritableContextMemoryMap.set(ctxSymbol, []);
    }
    inheritableContextMemoryMap.get(ctxSymbol).push(context);
  }

  getContext(ctxSymbol: symbol, key: string): InheritableContext | null {
    if (inheritableContextMemoryMap.has(ctxSymbol)) {
      return inheritableContextMemoryMap.get(ctxSymbol).find((c) => c.key === key) || null;
    }
    return null;
  }

  getClosestContext(ctxSymbol: symbol, key: string): InheritableContext | null {
    if (inheritableContextMemoryMap.has(ctxSymbol)) {
      const contexts = inheritableContextMemoryMap.get(ctxSymbol);
      const closestContext = contexts
        .filter((c) => c.key.length < key.length)
        .sort((a, b) => b.key.length - a.key.length)
        .find((c) => key.startsWith(c.key));
      return closestContext || null;
    }
    return null;
  }
}

export const InheritableContextManager = toSingleton(InheritableContextRegistry);
