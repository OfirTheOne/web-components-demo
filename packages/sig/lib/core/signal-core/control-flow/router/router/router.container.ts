import { DOM } from '@sigjs/dom';
import { BaseControlFlowComponentContainer } from '../../../../component-container/base-dynamic-template-component-container';
import { Route } from '@/common/router';
import { OneOrMany } from '@/types/one-or-many';
import { RenderUtils } from '@/core/utils';

const TAG_NAME = 'router-control'
DOM.creation.defineCustomElement(
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
    readonly placeholder = RenderUtils.createElementPlaceholder(TAG_NAME, this.key);

    render(): OneOrMany<HTMLElement> | null { return null}
}
