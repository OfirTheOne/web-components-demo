import { WC, createElement, createFragment } from "shared/jsx";
import { BaseWebComponent, OnConnected, OnDisconnected, defineComponent, OnAttributeChanged } from "shared/utils";
import { MyTabs } from "../tabs/tabs"

interface Attr {
  value: number;
  step: number;
}

export class CounterComponent extends BaseWebComponent<Attr> implements OnConnected, OnDisconnected, OnAttributeChanged {
  
  buildStyle(): string {
    return `
    button {
        width: 50px;
        height: 50px;
    
        border: 1px solid red;
        border-radius: 50%;
    
        background: tomato;
    
        color: white;
        font-weight: bold;
    
        cursor: pointer;
      }
    
      button:active {
        background-color: #D9391C;
      }
    
      span {
        display: inline-block;
        margin: 0 5px;
        min-width: 25px;
    
        text-align: center;
      }
    `;
  }

  buildTemplate() {
    return (<div>      
      {/* @ts-ignore */}
      <MyTabs></MyTabs>
      <button id="increaseBtn">+</button>
      <span id="label"></span>
      <button id="decreaseBtn">-</button>
    </div>);
  }

  static get observedAttributes() {
    return ['value', 'step'];
  }

  $increaseButton: HTMLElement;
  $decreaseButton: HTMLElement;
  $label: HTMLElement;

  constructor() {
    super();
    // set references to the DOM elements from the component's template
    this.$increaseButton = this.shadowRoot.querySelector('#increaseBtn');
    this.$decreaseButton = this.shadowRoot.querySelector('#decreaseBtn');
    this.$label = this.shadowRoot.querySelector('#label');
  }

  connectedCallback() {
    // add event listeners on both buttons
    this.$increaseButton.addEventListener('click', this.increase.bind(this));
    this.$decreaseButton.addEventListener('click', this.decrease.bind(this));
  }

  disconnectedCallback() {
    // remove event listeners on both buttons
    this.$increaseButton.removeEventListener('click', this.increase.bind(this));
    this.$decreaseButton.removeEventListener('click', this.decrease.bind(this));
  }

  attributeChangedCallback(_name: string, _oldValue: string, newValue: string) {
    this.$label.innerHTML = newValue;
  }

  private increase() {
    const step = +this.attr.step;
    const value = +this.attr.value;
    this.attr.value = value + step;
  }

  private decrease() {
    const step = +this.attr.step;
    const value = +this.attr.value;
    this.attr.value = value - step;
  }
}

defineComponent(
  'my-counter',
  CounterComponent
);

