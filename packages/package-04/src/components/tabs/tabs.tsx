
import { BaseWebComponent } from "shared/utils";
import { WC, createElement, createFragment } from "shared/jsx";

class MyTabs extends BaseWebComponent {
    constructor() {
        super(<div>{'TABS'}</div>);
    }

}

customElements.define(
    'my-tabss',
    MyTabs 
);

export { }