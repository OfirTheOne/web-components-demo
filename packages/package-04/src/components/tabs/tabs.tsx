
import { BaseWebComponent } from "shared/utils";
import { WC, createElement, createFragment } from "shared/jsx";

export class MyTabs extends BaseWebComponent {
    buildStyle() {
        return '';
    }
    buildTemplate() {
        return <div>{'TABS'}</div>;
    }

    constructor() {
        super();
    }

}

customElements.define(
    'my-tabss',
    MyTabs 
);

export { }