import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

const isBoolString = (val: string) => val === 'true' || val === 'false';
const isNumberString = (val: string) => !isNaN(val as unknown as number) && val !== '';

const attributesConvertor = (propsList: string[], attrName: string, attrValue: string) => {
  const propName = propsList.find(key => key.toLowerCase() == attrName);
  let value: (string | boolean | number | Record<string, unknown>) = attrValue;
  if (isBoolString(attrValue)) {
    value = attrValue == 'true';

  } else if (isNumberString(attrValue)) {
    value = +attrValue;
  
  } else if (/^{.*}/.exec(attrValue)) {
    value = JSON.parse(attrValue);
  }
  return {
    name: propName ? propName : attrName,
    value: value
  };
}

export const reactAdapter = (
    reactComponent: React.FC,
    propsList?: string[]
  ) => {
  const Comp = reactComponent;
  return class ReactElement extends HTMLElement {
    observer: MutationObserver;
    _innerHTML: string;
    constructor() {
      super();
      this.observer = new MutationObserver(() => this.update());
      this.observer.observe(this, { attributes: true });
    }

    connectedCallback() {
      this._innerHTML = this.innerHTML;
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
      const props = { ...this.getProps(this.attributes, propsList) };
      render(<Comp {...props}></Comp>, this);
    }

    unmount() {
      unmountComponentAtNode(this);
    }

    getProps(attributes: NamedNodeMap, propsList: string[] = []) {
      return [...attributes]
        .filter(attr => attr.name !== 'style')
        .map(attr => attributesConvertor(propsList, attr.name, attr.value))
        .reduce((props, prop) =>
          ({ ...props, [prop.name]: prop.value }), {});
    }
   
  }
}

