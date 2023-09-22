import { BaseControlFlowComponentContainer } from '../../../../component-container/base-dynamic-template-component-container';
import { defineComponent } from '../../../../utils/define-component';
import { Route } from '../../../../../common/router';
import { OneOrMany } from '../../../../../types/one-or-many';
import { createElementPlaceholder } from '../../../../utils/create-element-placeholder';

const TAG_NAME = 'router-control'
defineComponent(
    TAG_NAME,
    class extends HTMLElement {},
);

export class RouterControlFlowComponentContainer extends BaseControlFlowComponentContainer {
    onDispose(): void {
        console.log('onDispose');
    }
    domElementMemo: OneOrMany<HTMLElement> = null;
    renderRunBefore = false;
    route: Route | null;
    readonly placeholder = createElementPlaceholder(TAG_NAME, this.key);

    render(): OneOrMany<HTMLElement> | null { return null}
}
