import { SignalSubscriptionType } from '@/core/signal-core/models';
import { ISignal } from '@/core/signal-core/signal';

import { SignalRenderContextCommunicator } from '@/core/signal-core/render-context/signal-render-context-communicator';
import { RenderUtils, StylePropsUtils, BasicPropsUtils, EventPropsUtils } from '@/core/utils';
import { isSignal } from '@/core/utils/validators';


interface RawPrimitiveProps {
  style?: Record<string, unknown>;
  ref?: ((e: HTMLElement) => void) | { current: HTMLElement | null } | null;
  [key: string]: unknown;
}

export function primitiveElementRenderer(tag: string, props: Record<string, unknown>): HTMLElement {
  const element = document.createElement(tag);
  if (props) {
    const nonEmptyProps = props as RawPrimitiveProps;
    const { style: styleProp = {}, ref, ...propsEntries } = nonEmptyProps
    const basicMutatedProps = BasicPropsUtils.mutateBasicProps(propsEntries);
    if(basicMutatedProps['class:list']) {
      const classList = basicMutatedProps['class:list'] as Record<string, boolean | ISignal<unknown>>;
      Object.entries(classList).forEach(([className, shouldAdd]) => {
        let usedShouldAdd = shouldAdd;
        if(isSignal(shouldAdd)) {
          const currentContext = SignalRenderContextCommunicator.instance.currentContext;
          const signal: ISignal = shouldAdd;
          currentContext.subscribeSignal(signal, {
            componentKey: currentContext.componentKey,
            containerElement: element,
            signalId: signal.id,
            connected: true,
            type: SignalSubscriptionType.Class,
            propKey: className,
            id: signal.id,
          });
          usedShouldAdd = Boolean(signal.value);
        }
        if(usedShouldAdd) {
          element.classList.add(className);
        } else {
          element.classList.remove(className);
        }
      });
      delete basicMutatedProps['class:list'];
    }


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
    Object.entries(nativeStyleProp).forEach(([name, value]) => {
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

    const isStylePropEmpty = Object.keys(nativeStyleProp).length === 0;

    const finalMutatedProps = {
      ...eventMutatedProps,
      style: isStylePropEmpty ? null :
        StylePropsUtils.convertNativeStylePropObjectString(nativeStyleProp)
    };

    assignRef(ref, element);

    RenderUtils.appendDomProps(element, finalMutatedProps);
  }
  return element;
}

function assignRef(ref: ((e: HTMLElement) => void) | { current: HTMLElement | null } | null, element: HTMLElement) {
  if (ref) {
    if (typeof ref === 'function') {
      ref(element);
    } else if (!ref.current) {
      ref.current = element;
    }
  }
}