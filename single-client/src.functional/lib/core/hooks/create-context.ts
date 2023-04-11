import { HookType } from "src.functional/lib/models/i-render-context";
import {
  InheritableContext,
  ProviderFn,
  Context,
} from "../inheritable-context/inheritable-context";
import { InheritableContextManager } from "../inheritable-context/inheritable-context-repo";
import { RenderSignal } from "../render-signal";

export function createContext<T>(defaultValue: T): Context<T> {
  const contextSymbol = Symbol('Context');
  const Provider: ProviderFn = (_props, children) => {
    const currentRenderedContextKey = RenderSignal.instance.accessCurrentContext()?.key;
    const context =
      InheritableContextManager.instance.getContextValue(
        currentRenderedContextKey
      ) || new InheritableContext(contextSymbol, defaultValue);
    const setContextValue = (value: T) => (context.value = value);
    InheritableContextManager.instance.registerContext(
      currentRenderedContextKey,
      context
    );
    setContextValue(_props.value);
    context.provider = Provider;
    return children;
  };
  return { Provider };
}

export function useContext<T = any>(context: InheritableContext<T>): T {
  RenderSignal.instance.currentContext.declareHook(HookType.useContext);

  const currentRenderedContextKey =
    RenderSignal.instance.accessCurrentContext().key;

  if (!InheritableContextManager.instance.getContext(context.key)) {
    throw new Error(`Context with key ${context.key} does not exist.`);
  }
  const isComponentInContextScope = currentRenderedContextKey.startsWith(
    context.key
  );
  if (!isComponentInContextScope) {
    throw new Error(`Component is not in context scope.`);
  }
  return context.value;
}
