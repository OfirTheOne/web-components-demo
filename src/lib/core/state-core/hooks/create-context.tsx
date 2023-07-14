// import { Sig } from '../../../jsx';

import { HookType } from '../../../models/i-render-context';
import { ProviderContextInstance, ProviderFn, Context } from '../provider-context/provider-context';
import { ProviderContextRegistry } from '../provider-context/provider-context-registry';
import { RenderContextCommunicator } from '../render-context';

export function createContext<T>(defaultValue: T): Context<T> {
  const contextSymbol = Symbol('Context');
  const Provider: ProviderFn = (props = {}, children) => {
    const currentRenderedKey = RenderContextCommunicator.instance.accessCurrentContext()?.key;

    let context = ProviderContextRegistry.instance.getContext(contextSymbol, currentRenderedKey);
    if(!context) {
      context = new ProviderContextInstance(contextSymbol, defaultValue);
      ProviderContextRegistry.instance.registerContext(contextSymbol, context);
    }

    if ('value' in props) {
      context.value = props.value;
    }
    context.key = currentRenderedKey;
    context.provider = Provider;
    return <>{children}</>;
  };
  return { Provider, contextSymbol };
}

export function useContext<T = any>(context: Context<T>): T {
  RenderContextCommunicator.instance.currentContext.declareHook(HookType.useContext);
  const currentRenderedKey = RenderContextCommunicator.instance.accessCurrentContext().key;

  const closestContext = ProviderContextRegistry.instance.getClosestContext(context.contextSymbol, currentRenderedKey);

  if (!closestContext) {
    throw new Error(`Component is not in context scope.`);
  }
  return closestContext.value;
}
