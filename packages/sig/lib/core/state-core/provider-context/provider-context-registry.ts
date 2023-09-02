import { Ctor } from '@/types/ctor';
import { providerContextMemoryMap } from '../../global-storage';
import { toSingleton } from '../../utils/to-singleton';
import { ProviderContextInstance } from './provider-context';

export class ProviderContextRegistryInstance extends ProviderContextInstance {
  getContextValue<V = any>(ctxSymbol: symbol, key: string): V {
    if (providerContextMemoryMap.has(ctxSymbol)) {
      return this.getClosestContext(ctxSymbol, key)?.value;
    }
    return null;
  }

  registerContext(ctxSymbol: symbol, context: ProviderContextInstance) {
    if (providerContextMemoryMap.has(ctxSymbol)) {
      if (providerContextMemoryMap.get(ctxSymbol).find((c) => c.key === context.key)) {
        throw new Error(`InheritedContextRepo: Context with key ${context.key} already exists.`);
      }
    } else {
      providerContextMemoryMap.set(ctxSymbol, []);
    }
    providerContextMemoryMap.get(ctxSymbol).push(context);
  }

  getContext(ctxSymbol: symbol, key: string): ProviderContextInstance | null {
    if (providerContextMemoryMap.has(ctxSymbol)) {
      return providerContextMemoryMap.get(ctxSymbol).find((c) => c.key === key) || null;
    }
    return null;
  }

  getClosestContext(ctxSymbol: symbol, key: string): ProviderContextInstance | null {
    if (providerContextMemoryMap.has(ctxSymbol)) {
      const contexts = providerContextMemoryMap.get(ctxSymbol);
      const closestContext = contexts
        .filter((c) => c.key.length < key.length)
        .sort((a, b) => b.key.length - a.key.length)
        .find((c) => key.startsWith(c.key));
      return closestContext || null;
    }
    return null;
  }

  
}

export const ProviderContextRegistry = toSingleton(ProviderContextRegistryInstance as Ctor<ProviderContextRegistryInstance>);
