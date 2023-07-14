import { IComponentContainer } from '../../../models/i-component-container';
import { SignalRenderContext } from './signal-render-context';
import { signaledContextMemoryMap } from '../../global-storage';

class SignalRenderContextCommunicatorInstance {
  calledContextStack: SignalRenderContext[] = [];
  /* eslint-disable  @typescript-eslint/no-empty-function */
  protected constructor() {}
  get currentContext() {
    return this.calledContextStack.at(-1);
  }

  public getAllChildContexts(componentKey: string): SignalRenderContext[] {
    if(!signaledContextMemoryMap.has(componentKey)) {
      return [];
    }
    const sortedEntries = Array
      .from(signaledContextMemoryMap.entries())
      .sort((ea, eb) => ea[0].localeCompare(eb[0]));
    const keyIndex = sortedEntries.findIndex(([key]) => componentKey === key);
    return sortedEntries.slice(keyIndex).map(([, ctx]) => ctx);
  }

  public accessContext(componentKey: string): SignalRenderContext | null {
    if (signaledContextMemoryMap.has(componentKey)) {
      return signaledContextMemoryMap.get(componentKey) as SignalRenderContext;
    } else {
      return null;
    }
  }

  public setContext(componentKey: string, componentContainerRef: IComponentContainer) {
    let context: SignalRenderContext;
    if (signaledContextMemoryMap.has(componentKey)) {
      context = signaledContextMemoryMap.get(componentKey) as SignalRenderContext;
    } else {
      context = new SignalRenderContext(componentContainerRef, componentKey);
      signaledContextMemoryMap.set(componentKey, context);
    }
    this.calledContextStack.push(context);
  }

  public removeContext() {
    this.calledContextStack.pop();
  }

  public deleteStoredContext(componentKey: string) {
    return signaledContextMemoryMap.delete(componentKey);
  }
}

export class SignalRenderContextCommunicator extends SignalRenderContextCommunicatorInstance {
  private static _instance: SignalRenderContextCommunicatorInstance;

  static get instance() {
    if (!SignalRenderContextCommunicator._instance) {
      SignalRenderContextCommunicator._instance = new SignalRenderContextCommunicatorInstance();
    }
    return SignalRenderContextCommunicator._instance;
  }
}
