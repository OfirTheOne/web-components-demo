import { WC } from "../../jsx";

import { HookType } from "../../models/i-render-context";
import {
  InheritableContext,
  ProviderFn,
  Context,
} from "../inheritable-context/inheritable-context";
import { InheritableContextManager } from "../inheritable-context/inheritable-context-repo";
import { RenderSignal } from "../render-signal";

export function createContext<T>(defaultValue: T): Context<T> {
  const contextSymbol = Symbol("Context");
  const Provider: ProviderFn = (props = {}, children) => {
    const currentRenderedKey =
      RenderSignal.instance.accessCurrentContext()?.key;
    const context =
      (InheritableContextManager.instance.getContext(
        contextSymbol,
        currentRenderedKey
      ) as InheritableContext<T>) ||
      new InheritableContext(contextSymbol, defaultValue);
    InheritableContextManager.instance.registerContext(contextSymbol, context);
    if('value' in props) {
      context.value = props.value;
    }
    context.key = currentRenderedKey;
    context.provider = Provider;
    return <>{children}</>;
  };
  return { Provider, contextSymbol };
}

export function useContext<T = any>(context: Context<T>): T {
  RenderSignal.instance.currentContext.declareHook(HookType.useContext);
  const currentRenderedKey = RenderSignal.instance.accessCurrentContext().key;

  const closestContext = InheritableContextManager.instance.getClosestContext(
    context.contextSymbol,
    currentRenderedKey
  );

  if (!closestContext) {
    throw new Error(`Component is not in context scope.`);
  }
  return closestContext.value;
}
