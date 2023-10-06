import { DOM } from '@sig/dom'

export class EventPropsUtils {
  static mutateEventProps(props: Record<string, unknown>) {
    Object.entries(props).forEach(([name, value]) => {
      if (DOM.validation.isEventHandlerName(name)) {
        const eventName = name.toLowerCase().substring(2);
        props[eventName] = value;
        delete props[name];
      }
    });
    return props;
  }
}
