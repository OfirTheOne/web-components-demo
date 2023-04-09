import { InheritableContext, ProviderFn } from "../inheritable-context/inheritable-context";
import { InheritableContextManager } from "../inheritable-context/inheritable-context-repo";
import { RenderSignal } from "../render-signal";




export function createContext<T>(defaultValue: T): InheritableContext<T> {
  const context = new InheritableContext(defaultValue);
  const setContextValue = (value: T) => {
    context.value = value;
  };
  const registerContext = () => {
    const currentRenderedContextKey = RenderSignal.instance.accessCurrentContext()?.key;
    InheritableContextManager.instance.registerContext(currentRenderedContextKey, context);
  };
  const Provider: ProviderFn = (_props, children) => {
    registerContext();
    setContextValue(_props.value);
    return children;
  };
  context.provider = Provider;
  return context;
}

export function useContext<T = any>(context: InheritableContext<T>): T {
  const currentRenderedContextKey =
    RenderSignal.instance.accessCurrentContext().key;

  if(!InheritableContextManager.instance.getContext(context.key)) {
    throw new Error(`Context with key ${context.key} does not exist.`);
  }
  const isComponentInContextScope = currentRenderedContextKey.startsWith(context.key);
  if(!isComponentInContextScope) {
    throw new Error(`Component is not in context scope.`);
  }
  return context.value;
}
