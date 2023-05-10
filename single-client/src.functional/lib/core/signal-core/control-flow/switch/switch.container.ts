
import { OneOrMany } from '../../../../types/utils';
import { SignalRenderContextCommunicator } from '../../render-context/signal-render-context-communicator';
import { 
    CaseProps,
    SwitchProps 
} from './switch.control';
import { VirtualElement } from '../../../../models/virtual-element';
import { ControlFlow, Trackable } from '../../models';
import { BaseControlFlowComponentContainer } from '../../component-container/base-dynamic-template-component-container';


export class SwitchControlFlowComponentContainer extends BaseControlFlowComponentContainer {
  
    render(): OneOrMany<HTMLElement> | null {
      const domElement = this.resolveRenderedOutput();
  
      const switchProps = this.props as unknown as SwitchProps;
      const trackables: Trackable[] = switchProps.track;
      trackables.forEach((trackable) => {
        const emitter = 'emitter' in trackable ? trackable.emitter : trackable.source.emitter;
        const listener =  () => {
            this._container = this.resolveRenderedOutput();    
          }
        emitter.on('change', listener);
      });
      this._container = domElement;
      return domElement;
     
    }
  
    resolveRenderedOutput(): OneOrMany<HTMLElement> | null {
      SignalRenderContextCommunicator.instance.setContext(this.key, this);
      const switchProps = this.props as unknown as SwitchProps;
      const trackables: Trackable[] = switchProps.track;
      const trackablesValueSnapshot = trackables.map(t => t.value);
      const virtualChildren = this._children as unknown as VirtualElement[];    
      const virtualCaseChildren =  virtualChildren.filter(v => v.tag['$$control-flow'] === Symbol.for(ControlFlow.Case));
      const virtualCase = virtualCaseChildren.find(caseV => {
            const when = (caseV.props as CaseProps).when;
            if(typeof when == 'function') {
                return when(trackablesValueSnapshot);
            } 
            return false;
      });
      if(!virtualCase) {
        return null;
      }
      const domElement = <HTMLElement> this.internalRender(this._parent, virtualCase, this.key);
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
  



/*

<Switch 
    fallback={<p>{x} is between 5 and 10</p>}
    track={[x]}
>
  <Case when={xValue => xValue > 10}>
    <p>{x} is greater than 10</p>
  </Case>
  <Case when={xValue => 5 > xValue}>
    <p>{x} is less than 5</p>
  </Case>
</Switch>


  */