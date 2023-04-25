import { WC } from '../../jsx';

import { HookType } from '../../models/i-render-context';
import { InheritableContext, ProviderFn, Context } from '../inheritable-context/inheritable-context';
import { InheritableContextManager } from '../inheritable-context/inheritable-context-repo';
import { RenderContextCommunicator } from '../render-context';

export function createContext<T>(defaultValue: T): Context<T> {
  const contextSymbol = Symbol('Context');
  const Provider: ProviderFn = (props = {}, children) => {
    const currentRenderedKey = RenderContextCommunicator.instance.accessCurrentContext()?.key;

    let context = InheritableContextManager.instance.getContext(contextSymbol, currentRenderedKey);
    if(!context) {
      context = new InheritableContext(contextSymbol, defaultValue);
      InheritableContextManager.instance.registerContext(contextSymbol, context);
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

  const closestContext = InheritableContextManager.instance.getClosestContext(context.contextSymbol, currentRenderedKey);

  if (!closestContext) {
    throw new Error(`Component is not in context scope.`);
  }
  return closestContext.value;
}
