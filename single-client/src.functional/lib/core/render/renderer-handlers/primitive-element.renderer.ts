import { Props } from '../../../models/props';
import { Signal, SignalSubscriptionType } from '../../signal-core/models';
import { SignalRenderContextCommunicator } from '../../signal-core/render-context/signal-render-context-communicator';
import { RenderUtils } from '../../utils/render-utils';
import { isSignal } from '../../utils/validators';

export function primitiveElementRenderer(tag: string, props: Props) {
  const element = document.createElement(tag);
  if (props) {
    const nonEmptyProps = props;
    const styleProp = <Record<string, unknown>>nonEmptyProps['style'];
    const refProp = <(e: HTMLElement) => void>nonEmptyProps['ref'];
    const propsEntries = Object.entries(nonEmptyProps).filter(([propKey]) => !['style', 'ref'].includes(propKey));
    const mutatedPropsEntries = RenderUtils.handleAttributeMutation(propsEntries);
    if (styleProp && typeof styleProp == 'object') {
      element.setAttribute('style', RenderUtils.convertStyleObjectToInlineStyle(styleProp));
    }
    if (refProp && typeof refProp === 'function') {
      refProp(element);
    }
    RenderUtils.appendDomProps(element, mutatedPropsEntries);
  }
  return element;
}

export function signalPrimitiveElementRenderer(tag: string, props: Props) {
  const element = document.createElement(tag);
  if (props) {
    const nonEmptyProps = props;
    const styleProp = <Record<string, unknown>>nonEmptyProps['style'];

    Object.entries(styleProp).map(([name, value]) => {
      if (isSignal(value)) {
        const currentContext = SignalRenderContextCommunicator.instance.currentContext;
        const signal: Signal = value;
        currentContext.subscribeSignal(signal, {
          componentKey: currentContext.componentKey,
          containerElement: element,
          signalId: signal.id,
          connected: true,
          type: SignalSubscriptionType.Style,
          propKey: name,
          id: signal.id,
        });
      }
    });

    const propsEntries = Object.entries(nonEmptyProps).filter(([propKey]) => !['style', 'ref'].includes(propKey));
    const mutatedPropsEntries = RenderUtils.handleAttributeMutation(propsEntries);
    if (styleProp && typeof styleProp == 'object') {
      element.setAttribute('style', RenderUtils.convertStyleObjectToInlineStyle(styleProp));
    }
    RenderUtils.appendDomProps(element, mutatedPropsEntries);
  }
  return element;
}
