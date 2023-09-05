import { ISignal, SignalSubscriptionType } from '@/core/signal-core/models';
import { SignalRenderContextCommunicator } from '@/core/signal-core/render-context/signal-render-context-communicator';
import { RenderUtils, StylePropsUtils, BasicPropsUtils, EventPropsUtils } from '@/core/utils/render-utils';
import { isSignal } from '@/core/utils/validators';


interface RawPrimitiveProps {
  style?: Record<string, unknown>;
  ref?: (e: HTMLElement) => void;
  [key: string]: unknown;
}

export function primitiveElementRenderer(tag: string, props: Record<string, unknown>): HTMLElement {
  const element = document.createElement(tag);
  if (props) {
    const nonEmptyProps = props as RawPrimitiveProps;
    const { style: styleProp = {}, ref, ...propsEntries } = nonEmptyProps   
    const basicMutatedProps = BasicPropsUtils.mutateBasicProps(propsEntries);
    const eventMutatedProps = EventPropsUtils.mutateEventProps(basicMutatedProps);
    Object.entries(eventMutatedProps).forEach(([name, value]) => {
      if (isSignal(value)) {
        const currentContext = SignalRenderContextCommunicator.instance.currentContext;
        const signal: ISignal = value;
        currentContext.subscribeSignal(signal, {
          componentKey: currentContext.componentKey,
          containerElement: element,
          signalId: signal.id,
          connected: true,
          type: SignalSubscriptionType.Property,
          propKey: name,
          id: signal.id,
        });
        eventMutatedProps[name] = signal.value;
      }
    });

    const nativeStyleProp = StylePropsUtils.convertStylePropObjectToNativeStylePropObject(styleProp);
    Object.entries(nativeStyleProp).map(([name, value]) => {
      if (isSignal(value)) {
        const currentContext = SignalRenderContextCommunicator.instance.currentContext;
        const signal: ISignal = value;
        currentContext.subscribeSignal(signal, {
          componentKey: currentContext.componentKey,
          containerElement: element,
          signalId: signal.id,
          connected: true,
          type: SignalSubscriptionType.Style,
          propKey: name,
          id: signal.id,
        });
        nativeStyleProp[name] = signal.value;
      }
    });
    const finalMutatedProps = {
      ...eventMutatedProps,
      style: (nativeStyleProp && typeof nativeStyleProp === 'object') 
        ? StylePropsUtils.convertNativeStylePropObjectString(nativeStyleProp) : ''
    };

    if (ref && typeof ref === 'function') {
      ref(element);
    }
  
    RenderUtils.appendDomProps(element, finalMutatedProps);
  }
  return element;
}
