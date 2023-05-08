
import { OneOrMany } from '../../../../types/utils';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { SlotProps } from '../../dynamic-template/slot/slot.dynamic';
import { VirtualElement } from '../../../../models/virtual-element';
import { ComponentKeyBuilder } from '../../../component-key-builder';
import { BaseDynamicTemplateComponentContainer } from './../../component-container/base-dynamic-template-component-container';

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
  