
import { 
    BaseWebComponent,
    defineComponent,
    
} from 'shared/utils';

defineComponent('my-button',
    class MyButton extends BaseWebComponent {
        constructor() {
            super(document.createElement('button'));
            const children = this.childNodes;
            this.container.append(...children);
            children.forEach(node => this.removeChild(node));
        }
    }
);
export { }
