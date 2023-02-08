import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
// import Graphs from './Graphs'

class ReactElement extends HTMLElement {
  username = '';
  observer: MutationObserver;
  _innerHTML: string;
  constructor() {
    super();
    this.observer = new MutationObserver(() => this.update());
    this.observer.observe(this, { attributes: true });
  }

  connectedCallback() {
    this._innerHTML = this.innerHTML;
    this.username = this.getAttribute("username");
    this.mount();
  }

  disconnectedCallback() {
    this.unmount();
    this.observer.disconnect();
  }

  update() {
    this.unmount();
    this.mount();
  }

  mount() {
    // const propTypes = Graphs.propTypes ? Graphs.propTypes : {};
    // const props = {
    //   ...this.getProps(this.attributes, propTypes),
    // };
    render(
        <div>
            username : { this.username }
        </div>, 
    this);
  }

  unmount() {
    unmountComponentAtNode(this);
  }

  getProps(attributes, propTypes) {
    propTypes = propTypes|| {};
    let arr  =  [ ...attributes ]         
      .filter(attr => attr.name !== 'style')         
      .map(attr => this.convert(propTypes, attr.name, attr.value))
      .reduce((props, prop) => 
        ({ ...props, [prop.name]: prop.value }), {});
    return arr 
  }

  convert(propTypes, attrName, attrValue) {
    const propName = Object.keys(propTypes)
      .find(key => key.toLowerCase() == attrName);
    let value = attrValue;
    if (attrValue === 'true' || attrValue === 'false') 
      value = attrValue == 'true';      
    else if (!isNaN(attrValue) && attrValue !== '') 
      value = +attrValue;      
    else if (/^{.*}/.exec(attrValue)) 
      value = JSON.parse(attrValue);
    return {         
      name: propName ? propName : attrName,         
      value: value      
    };
  }
}

export {}
customElements.define('react-el', ReactElement);