import { Props } from '../../../models/props';
import { ISignal, SignalSubscriptionType } from '../../signal-core/models';
import { SignalRenderContextCommunicator } from '../../signal-core/render-context/signal-render-context-communicator';
import { RenderUtils, StylePropsUtils } from '../../utils/render-utils';
import { isSignal } from '../../utils/validators';


interface RawPrimitiveProps {
  style?: Record<string, unknown>;
  ref?: (e: HTMLElement) => void;
  [key: string]: unknown;
}

export function primitiveElementRenderer(tag: string, props: Props) {
  const element = document.createElement(tag);
  if (props) {
    const nonEmptyProps = props as RawPrimitiveProps;
    const { styleProp, ref, ...propsEntries } = nonEmptyProps   

    const mutatedProps = RenderUtils.handleAttributeMutation(propsEntries);
    Object.entries(mutatedProps).forEach(([name, value]) => {
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
        mutatedProps[name] = signal.value;
      }
    });

    const nativeStyleObject = StylePropsUtils.convertStylePropObjectToNativeStylePropObject(propsEntries);
    Object.entries(nativeStyleObject).map(([name, value]) => {
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
        nativeStyleObject[name] = signal.value;
      }
    });

    if (styleProp && typeof styleProp == 'object') {
      element.setAttribute('style', StylePropsUtils.convertNativeStylePropObjectString(nativeStyleObject));
    }
    if (ref && typeof ref === 'function') {
      ref(element);
    }
  
    RenderUtils.appendDomProps(element, mutatedProps);
  }
  return element;
}

// export function signalPrimitiveElementRenderer(tag: string, props: Props) {
//   const element = document.createElement(tag);
//   if (props) {
//     const nonEmptyProps = props;
//     const styleProp = <Record<string, unknown>>nonEmptyProps['style'];

//     Object.entries(styleProp).map(([name, value]) => {
//       if (isSignal(value)) {
//         const currentContext = SignalRenderContextCommunicator.instance.currentContext;
//         const signal: ISignal = value;
//         currentContext.subscribeSignal(signal, {
//           componentKey: currentContext.componentKey,
//           containerElement: element,
//           signalId: signal.id,
//           connected: true,
//           type: SignalSubscriptionType.Style,
//           propKey: name,
//           id: signal.id,
//         });
//       }
//     });

//     const propsEntries = Object.entries(nonEmptyProps).filter(([propKey]) => !['style', 'ref'].includes(propKey));
//     const mutatedPropsEntries = RenderUtils.handleAttributeMutation(propsEntries);

//     const unwrappedPropsEntries = mutatedPropsEntries.map(([name, value]) => {
//       if (isSignal(value)) {
//         const currentContext = SignalRenderContextCommunicator.instance.currentContext;
//         const signal: ISignal = value;
//         currentContext.subscribeSignal(signal, {
//           componentKey: currentContext.componentKey,
//           containerElement: element,
//           signalId: signal.id,
//           connected: true,
//           type: SignalSubscriptionType.Property,
//           propKey: name,
//           id: signal.id,
//         });
//         return signal.value;
//       }
//       return value;
//     });

//     if (styleProp && typeof styleProp == 'object') {
//       element.setAttribute('style', RenderUtils.convertStyleObjectToInlineStyle(styleProp));
//     }
//     RenderUtils.appendDomProps(element, unwrappedPropsEntries);
//   }
//   return element;
// }
