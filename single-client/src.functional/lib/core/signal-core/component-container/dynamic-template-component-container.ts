import { DOMUtils } from '../../utils/dom-utils';
import { VirtualRender } from '../../types';
import { IComponentContainer } from '../../../models/i-component-container';
import { OneOrMany } from '../../../types/utils';
import { Props } from '../../../models/props';
import { VirtualFnComponent } from '../../../models/virtual-fn-component';
import { SignalRenderContextCommunicator } from '../render-context/signal-render-context-communicator';
import { ShowPropsWithTrack, ShowPropsWithoutTrack } from '../dynamic-template/show/show.dynamic';
import { SlotProps } from '../dynamic-template/slot/slot.dynamic';
import { VirtualElement } from '../../../models/virtual-element';
import { DynamicTemplate, Trackable } from '../models';
import { ComponentKeyBuilder } from '../../component-key-builder';


export abstract class BaseDynamicTemplateComponentContainer implements IComponentContainer {
  protected _container: OneOrMany<HTMLElement>;

  constructor(
    protected fnComponent: VirtualFnComponent,
    protected _props: Props,
    protected _children: any[],
    protected key: string,
    protected _parent: HTMLElement | null,
    protected style: any,
    protected options: Record<string, any>,
    protected internalRender: VirtualRender
  ) {}

  setParent(parent: HTMLElement | null) {
    this._parent = parent;
    return this;
  }
  setProps(props: Props) {
    this._props = props;
    return this;
  }
  setChildren(children: any[]) {
    this._children = children;
    return this;
  }

  public get children() {
    return this._children;
  }
  public get props() {
    return this._props;
  }
  public get container() {
    return this._container;
  }
  public get wasRenderedBefore() {
    return this._container !== undefined;
  }

  abstract render(): OneOrMany<HTMLElement> | null;
  

  onUnmount() {
    SignalRenderContextCommunicator.instance.deleteStoredContext(this.key);
  }

  registerDynamicTemplateUpdate() {
    return (() => {
      this.render();
    });
  }

  public connectOnMount(domElement: OneOrMany<HTMLElement>) {
    DOMUtils.appendToParent(this._parent, domElement);
  }
  public connectOnSelfRerender(domElement: OneOrMany<HTMLElement>) {
    const firstContainerNode = Array.isArray(this._container) ? this._container[0] : this._container;
    const renderStartPointNode = (
      DOMUtils.isOnlyChild(firstContainerNode) ? null : firstContainerNode.previousSibling
    ) as HTMLElement | null;
    DOMUtils.removeSelf(this._container);
    DOMUtils.insertChildAfterNode(this._parent, domElement, renderStartPointNode);
  }
}

export class NoneDynamicTemplateComponentContainer extends BaseDynamicTemplateComponentContainer {
  render(): OneOrMany<HTMLElement> | null {
    throw new Error('Method not implemented.');
  }
}


export class ShowDynamicTemplateComponentContainer extends BaseDynamicTemplateComponentContainer {
  
  render(): OneOrMany<HTMLElement> | null {
    const domElement = this.resolveRenderedOutput();

    const showProps = this.props as ShowPropsWithoutTrack | ShowPropsWithTrack;
    let trackables: Trackable[];
    if(typeof showProps.when !== 'function') {
      const showWithoutTrackProps = this.props as ShowPropsWithoutTrack;
      const { when } = showWithoutTrackProps;
      trackables = [when];
    } else {
      const showWithTrackProps = this.props as ShowPropsWithTrack;
      const { track } = showWithTrackProps;
      trackables = track;
    }

    trackables.forEach((trackable) => {
      const emitter = 'emitter' in trackable ? trackable.emitter : trackable.source.emitter
      emitter.on('change', () => {
        this._container = this.resolveRenderedOutput();    
      })
    });
    this._container = domElement;
    return domElement;
   
  }

  resolveRenderedOutput(): OneOrMany<HTMLElement> | null {
    SignalRenderContextCommunicator.instance.setContext(this.key, this);
  
    // const virtualElement = this.fnComponent(this._props || {}, this._children);
    // const isUnmounted = virtualElement == null;
    const showProps = this.props as ShowPropsWithoutTrack | ShowPropsWithTrack;

    const defaultVirtualView = this._children as unknown as VirtualElement[];
    const fallbackVirtualView = (showProps.fallback || null) as unknown as VirtualElement;
    let whenResult: boolean;

    if(typeof showProps.when !== 'function') {
      const showWithoutTrackProps = this.props as ShowPropsWithoutTrack;
      const { when } = showWithoutTrackProps;
      whenResult = !!(when.value);
    } else {
      const showWithTrackProps = this.props as ShowPropsWithTrack;
      const { when, track } = showWithTrackProps;
      const values = track.map(signal => signal.value);
      whenResult = when(values);
    }
    const virtualOutput: OneOrMany<VirtualElement> = whenResult ? defaultVirtualView : fallbackVirtualView;
    
    const domElement = <HTMLElement> (Array.isArray(virtualOutput) ? 
      virtualOutput.map(v => this.internalRender(this._parent, v, this.key)) : 
      this.internalRender(this._parent, virtualOutput, this.key));
    SignalRenderContextCommunicator.instance.removeContext();
    if (this._parent) {
      if (this.wasRenderedBefore) {
        this.connectOnSelfRerender(domElement);
      } else {
        this.connectOnMount(domElement);
      }
    }
    return domElement;
  }
}



export class SlotDynamicTemplateComponentContainer extends BaseDynamicTemplateComponentContainer {
  
  render(): OneOrMany<HTMLElement> | null {
    const domElement = this.resolveRenderedOutput();
    const slotProps = this.props as SlotProps;
    const { track: trackables } = slotProps;

    trackables.forEach((trackable) => {
      const emitter = 'emitter' in trackable ? trackable.emitter : trackable.source.emitter
      emitter.on('change', () => {
        this._container = this.resolveRenderedOutput();    
      })
    });
    this._container = domElement;
    return domElement;
   
  }

  resolveRenderedOutput(): OneOrMany<HTMLElement> | null {
    SignalRenderContextCommunicator.instance.setContext(this.key, this);

    const slotProps = this.props as SlotProps;
    const virtualViewFactory =  (Array.isArray(this._children) ? 
      this._children[0] : this._children
    ) as unknown as ((...args: unknown[]) => OneOrMany<VirtualElement>);

    const { track: trackables } = slotProps;
    const virtualOutput: OneOrMany<VirtualElement> = virtualViewFactory(...trackables.map(t => t.value));
    
    const domElement = <HTMLElement> (Array.isArray(virtualOutput) ? 
      virtualOutput.map(v => this.internalRender(this._parent, v, this.key)) : 
      this.internalRender(this._parent, virtualOutput, this.key));
    SignalRenderContextCommunicator.instance.removeContext();
    if (this._parent) {
      if (this.wasRenderedBefore) {
        this.connectOnSelfRerender(domElement);
      } else {
        this.connectOnMount(domElement);
      }
    }
    return domElement;
  }

  coreRender(parent: HTMLElement, virtualOutput: OneOrMany<VirtualElement>, key: string): HTMLElement {
    const domElement = <HTMLElement> (Array.isArray(virtualOutput) ? 
      virtualOutput.map((v, i)=> this.internalRender(
        parent, v, 
        ComponentKeyBuilder.build(key).idx(i).toString()
      )) : 
      this.internalRender(parent, virtualOutput, key));
    return domElement;
  }
}


const DYNAMIC_TEMPLATE_HANDLER_MAP= {
  [Symbol.for(DynamicTemplate.Show)]: ShowDynamicTemplateComponentContainer,
  [Symbol.for(DynamicTemplate.Slot)]: SlotDynamicTemplateComponentContainer,
} as const;

export class DynamicTemplateComponentContainerFactory {
  static create(
    dynamicTemplateSymbol: symbol,
    fnComponent: VirtualFnComponent,
    props: Props,
    children: any[],
    key: string,
    parent: HTMLElement | null,
    style: any,
    options: Record<string, any>,
    internalRender: VirtualRender
  ) {
   const DynamicTemplateComponentContainer 
    = DYNAMIC_TEMPLATE_HANDLER_MAP[dynamicTemplateSymbol] 
    || NoneDynamicTemplateComponentContainer;
    
  return new DynamicTemplateComponentContainer(
    fnComponent, 
    props, 
    children, 
    key, 
    parent, 
    style, 
    options, 
    internalRender);
  }
} 

