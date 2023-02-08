

import { 
    BaseWebComponent,
    defineComponent,
} from 'shared/utils';

defineComponent('my-input',
    class MyInput extends BaseWebComponent {
        constructor() {
            super(document.createElement('input'));
            this.container.classList.add("my-input");
            const children = this.childNodes;
            this.container.append(...children);
            children.forEach(node => this.removeChild(node));
        }
    }
);

