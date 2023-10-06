import { isSignal, isDerivedSignal } from '@sigjs/signal';
import { DOM } from '@sigjs/dom';
import { SignalSubscriptionType } from '@/core/signal-core/models';
import { SignalRenderContextCommunicator } from '@/core/signal-core/render-context/signal-render-context-communicator';
import { RenderUtils, StylePropsUtils, BasicPropsUtils, EventPropsUtils } from '@/core/utils';

interface RawPrimitiveProps {
  style?: Record<string, unknown>;
  ['class:list']?: Sig.ClassList
  className?: string;
  ref?: ((e: Element) => void) | { current: Element | null } | null;
  [key: string]: unknown;
}

export function primitiveElementRenderer(tag: string, props: Record<string, unknown>): HTMLElement {
  const element = DOM.creation.createElement(tag);
  if (props) {
    const nonEmptyProps = props as RawPrimitiveProps;
    const { style: styleProp = {}, ref, className, "class:list": classList, ...propsEntries } = nonEmptyProps;
    const classPropsHandled = classHandling(element, { classList, className })
    const stylePropsHandled = styleHandling(element, styleProp);
    const propsEntriesHandled = propsHandling(element, propsEntries);
    const finalMutatedProps = {
      ...propsEntriesHandled,
      class: classPropsHandled,
      style: stylePropsHandled,
    };
    assignRef(ref, element);
    RenderUtils.appendDomProps(element, finalMutatedProps);
  }
  return element as HTMLElement;
}

function styleHandling(element: Element, styleProp: Record<string, unknown>): string | null {
  if(Object.keys(styleProp).length === 0) {
    return null;
  }
  let nativeStyleProp:  Record<string, unknown>;
  if(isSignal(styleProp)) {
    const currentContext = SignalRenderContextCommunicator.instance.currentContext;
    const $signal = styleProp;
    currentContext.subscribeSignal($signal, {
      componentKey: currentContext.componentKey,
      containerElement: element,
      signalId: $signal.id,
      connected: true,
      type: SignalSubscriptionType.Style,
      propKey: "style",
      id: $signal.id,
    });
    nativeStyleProp = StylePropsUtils
      .convertStylePropObjectToNativeStylePropObject(styleProp.value as Record<string, unknown>);
  } else {
    nativeStyleProp = StylePropsUtils.convertStylePropObjectToNativeStylePropObject(styleProp);
  } 
  Object.entries(nativeStyleProp).forEach(([name, value]) => {
    if (isSignal(value) || isDerivedSignal(value)) {
      const currentContext = SignalRenderContextCommunicator.instance.currentContext;
      const $signal = value;
      currentContext.subscribeSignal($signal, {
        componentKey: currentContext.componentKey,
        containerElement: element,
        signalId: $signal.id,
        connected: true,
        type: SignalSubscriptionType.StyleProp,
        propKey: name,
        id: $signal.id,
      });
      nativeStyleProp[name] = $signal.value;
    }
  });
  return StylePropsUtils.convertNativeStylePropObjectString(nativeStyleProp);
}
function classHandling(element: Element, classProp: { classList: Sig.ClassList, className: string }): string | null {
  const { classList, className } = classProp;
  if(classList) {
    const classListSet: Set<string> = new Set<string>;
    const {
      classNameDict,
      toggleClassList,
      replaceClassList
    } = BasicPropsUtils.resolveClassList(classList)      
    Object.entries(classNameDict).forEach(([className, shouldAdd]) => {
      if(shouldAdd) {
        classListSet.add(className);
      } else {
        classListSet.delete(className);
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
      classListSet.add(className);
    });

    Object.entries(toggleClassList).forEach(([className, $shouldAddSignal]) => {
      if(isSignal($shouldAddSignal) || isDerivedSignal($shouldAddSignal)) {
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
          classListSet.add(className);
        } else {
          classListSet.delete(className);
        }
      }
    });
    return Array.from(classListSet.values()).join(' ');
  } else if(className) {
    return className;
  } 
  return null;
}
function propsHandling(element: Element, propsEntries: Record<string, unknown>): Record<string, unknown> {
  const eventMutatedProps = EventPropsUtils.mutateEventProps(propsEntries);
  Object.entries(eventMutatedProps).forEach(([name, value]) => {
    if (isSignal(value) || isDerivedSignal(value)) {
      const currentContext = SignalRenderContextCommunicator.instance.currentContext;
      const $signal = value;
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

  return eventMutatedProps;
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