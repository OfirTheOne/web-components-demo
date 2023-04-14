import { IComponentContainer } from 'src.functional/lib/models/i-component-container';
import { RenderContext } from './render-context';
import { renderContextMemoryMap } from './../global-storage';

class RenderSignalContext {
  private _currentContext: RenderContext | null = null;

  /* eslint-disable  @typescript-eslint/no-empty-function */
  protected constructor() {}
  get currentContext() {
    return this._currentContext;
  }

  public accessCurrentContext(): RenderContext | null {
    return this._currentContext;
  }

  public signalContext(componentKey: string, componentContainerRef: IComponentContainer) {
    let context: RenderContext;
    if (renderContextMemoryMap.has(componentKey)) {
      context = renderContextMemoryMap.get(componentKey) as RenderContext;
    } else {
      context = new RenderContext(componentContainerRef, componentKey);
      renderContextMemoryMap.set(componentKey, context);
    }
    this._currentContext = context;
  }

  public removeContext() {
    this._currentContext.cleanup();
    this._currentContext = null;
  }

  public deleteStoredContext(componentKey: string) {
    return renderContextMemoryMap.delete(componentKey);
  }
}

export class RenderSignal extends RenderSignalContext {
  private static _instance: RenderSignalContext;

  static get instance() {
    if (!RenderSignal._instance) {
      RenderSignal._instance = new RenderSignalContext();
    }
    return RenderSignal._instance;
  }
}
