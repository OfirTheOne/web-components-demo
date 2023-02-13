
import { 
    BaseWebComponent,
    defineComponent,
    
} from 'shared/utils';

defineComponent('my-button',
    class MyButton extends BaseWebComponent {
        buildStyle(): string {
            return '';
        }
        buildTemplate(): string | HTMLElement{
            return document.createElement('button');
        }

        constructor() {
            super();
            const children = this.childNodes;
            this.container.append(...children);
            children.forEach(node => this.removeChild(node));
        }
    }
);
export { }
