

import { BaseWebComponent } from "../../utils/base-web-component";
import { attachShadowDom } from "./../../utils/attach-shadow-dom";
import { defineComponent } from "./../../utils/define-component";
import { parseHTML, withContainer } from "./../../utils/parse-html";

export const NavBar = defineComponent('my-nav-bar',
  class NavBar extends BaseWebComponent {
    constructor() {
      super();

      this.container.classList.add('nav-bar-container');
      this.styleElement.textContent = `
        .nav-bar-container nav-bar  {
          display: flex;
        }

        .nav-bar-container nav-bar div {
          display: flex;
        }
      `;

      withContainer(this.container)`
        <nav-bar> 
          <div> A </div>
          <div> B </div>
          <div> C </div>
        </nav-bar>
      `;
    }
  }
);

