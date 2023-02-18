

import { 
    defineComponent,
} from 'shared/utils';
import { BaseWebComponent } from "shared/core";

defineComponent('my-input',
    class MyInput extends BaseWebComponent {
        buildStyle(): string {
            return '';
        }
        buildTemplate(): string | HTMLElement {
            return document.createElement('input');
        }

        constructor() {
            super();
            this.container.classList.add("my-input");
            const children = this.childNodes;
            this.container.append(...children);
            children.forEach(node => this.removeChild(node));
        }
    }
);

