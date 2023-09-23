import { isCapitalEventName } from '../validators/is-capital-event-name';


export class EventPropsUtils {
    static mutateEventProps(props: Record<string, unknown>) {
        Object.entries(props).forEach(([name, value]) => {
  
        if (isCapitalEventName(name) && typeof value === 'function') {
          const eventName = name.toLowerCase().substring(2) as keyof HTMLElementEventMap;
          props[eventName] = value;
          delete props[name];
        }
      });
      return props;
    }
  }
  