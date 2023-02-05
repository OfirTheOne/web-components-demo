

import { BaseWebComponent } from "../../utils/base-web-component";
import { attachShadowDom } from "./../../utils/attach-shadow-dom";
import { defineComponent } from "./../../utils/define-component";
import { parseHTML, withContainer } from "./../../utils/parse-html";


export const MyButton = defineComponent('my-button',
    class MyButton extends BaseWebComponent {
        constructor() {
            super();
            withContainer(this.container)`
                <button class="count"> My Button </button>
            `;
        }
    }
);
