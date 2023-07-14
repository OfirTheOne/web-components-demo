import { SignalRenderContextCommunicator } from '../../../render-context/signal-render-context-communicator';
import { RouterProps } from './router.control';
import { BaseControlFlowComponentContainer } from '../../../component-container/base-dynamic-template-component-container';
import { ComponentKeyBuilder } from '../../../../component-key-builder';
import { defineComponent } from '../../../../utils/define-component';
import { Route, router } from '../../../../../common/router';
import { VirtualElement, FC } from '../../../../../models';
import { OneOrMany } from '../../../../../types/utils';

const TAG_NAME = 'router-control'
defineComponent(
    TAG_NAME,
    class extends HTMLElement {},
);

const createPlaceholder = (key: string) => {
   const ph = document.createElement(TAG_NAME);
   ph.setAttribute('role', 'ph');
   ph.setAttribute('for', key);
   ph.style.display = 'none';
   ph.style.visibility = 'hidden';
   return ph;
}

export class RouterControlFlowComponentContainer extends BaseControlFlowComponentContainer {
    onDispose(): void {
        console.log('onDispose');
    }
    domElementMemo: OneOrMany<HTMLElement> = null;
    renderRunBefore = false;
    route: Route | null;
    readonly placeholder = createPlaceholder(this.key);

    render(): OneOrMany<HTMLElement> | null { return null}

}
