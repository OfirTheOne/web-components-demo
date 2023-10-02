import { isSignal } from '@sig/signal';
import { DOM } from '@sig/dom';
import { SignalSubscriptionType } from '@/core/signal-core/models';
import { ISignal } from '@/core/signal-core/signal';
import { SignalRenderContextCommunicator } from '@/core/signal-core/render-context/signal-render-context-communicator';
import {  RenderUtils, StylePropsUtils, BasicPropsUtils, EventPropsUtils } from '@/core/utils';


interface RawPrimitiveProps {
  style?: Record<string, unknown>;
  ref?: ((e: Element) => void) | { current: Element | null } | null;
  [key: string]: unknown;
}

export function primitiveElementRenderer(tag: string, props: Record<string, unknown>): HTMLElement {
  const element = DOM.creation.createElement(tag);
  if (props) {
    const nonEmptyProps = props as RawPrimitiveProps;
    const { style: styleProp = {}, ref, ...propsEntries } = nonEmptyProps
    const basicMutatedProps = BasicPropsUtils.mutateBasicProps(propsEntries);
    if(basicMutatedProps['class:list']) {
      const {
        classNameDict,
        toggleClassList,
        replaceClassList
      } = BasicPropsUtils.resolveClassList(basicMutatedProps['class:list'] as Sig.ClassList)      
      Object.entries(classNameDict).forEach(([className, shouldAdd]) => {
        if(shouldAdd) {
          DOM.elementManipulation.addClass(element, className);
        } else {
          DOM.elementManipulation.removeClass(element, className);
        }
      });
      replaceClassList.forEach(($signal) => {
        const currentContext = SignalRenderContextCommunicator.instance.currentContext;
        currentContext.subscribeSignal($signal, {
          componentKey: currentContext.componentKey,
          containerElement: element,
          signalId: $signal.id,
          connected: true,
          type: SignalSubscriptionType.ClassReplace,
          propKey: "class",
          id: $signal.id,
        });
        const className = String($signal.value);
        DOM.elementManipulation.addClass(element, className);
      });

      Object.entries(toggleClassList).forEach(([className, $shouldAddSignal]) => {
        if(isSignal($shouldAddSignal)) {
          const currentContext = SignalRenderContextCommunicator.instance.currentContext;
          currentContext.subscribeSignal($shouldAddSignal, {
            componentKey: currentContext.componentKey,
            containerElement: element,
            signalId: $shouldAddSignal.id,
            connected: true,
            type: SignalSubscriptionType.ClassToggle,
            propKey: className,
            id: $shouldAddSignal.id,
          });
          const shouldAdd = Boolean($shouldAddSignal.value);
          if(shouldAdd) {
            DOM.elementManipulation.addClass(element, className);
          } else {
            DOM.elementManipulation.removeClass(element, className);
          }
        }
      });
      delete basicMutatedProps['class:list'];
    }

    const eventMutatedProps = EventPropsUtils.mutateEventProps(basicMutatedProps);
    Object.entries(eventMutatedProps).forEach(([name, value]) => {
      if (isSignal(value)) {
        const currentContext = SignalRenderContextCommunicator.instance.currentContext;
        const $signal: ISignal = value;
        currentContext.subscribeSignal($signal, {
          componentKey: currentContext.componentKey,
          containerElement: element,
          signalId: $signal.id,
          connected: true,
          type: SignalSubscriptionType.Property,
          propKey: name,
          id: $signal.id,
        });
        eventMutatedProps[name] = $signal.value;
      }
    });

    const nativeStyleProp = StylePropsUtils.convertStylePropObjectToNativeStylePropObject(styleProp);
    Object.entries(nativeStyleProp).forEach(([name, value]) => {
      if (isSignal(value)) {
        const currentContext = SignalRenderContextCommunicator.instance.currentContext;
        const $signal: ISignal = value;
        currentContext.subscribeSignal($signal, {
          componentKey: currentContext.componentKey,
          containerElement: element,
          signalId: $signal.id,
          connected: true,
          type: SignalSubscriptionType.Style,
          propKey: name,
          id: $signal.id,
        });
        nativeStyleProp[name] = $signal.value;
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
  return element as HTMLElement;
}

function assignRef(ref: ((e: Element) => void) | { current: Element | null } | null, element: Element) {
  if (ref) {
    if (typeof ref === 'function') {
      ref(element);
    } else if (!ref.current) {
      ref.current = element;
    }
  }
}



/*

[ 
  "class A",
  "class B",
  signal "class C",
  { "class B": signal },
 "class D",
  single "class A" 
]

*/