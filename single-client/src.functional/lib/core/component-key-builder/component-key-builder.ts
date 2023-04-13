import { StringBuilder } from '../../common/string-builder';
import { ComponentKeyToken } from './component-key-token';

export class ComponentKeyBuilder extends StringBuilder {
  static build(value?: string | string[] | StringBuilder) {
    return new ComponentKeyBuilder(value);
  }
  constructor(value: string | string[] | StringBuilder = []) {
    super(value);
  }
  root() {
    this.append(ComponentKeyToken.ROOT);
    return this;
  }
  fragment() {
    this.append(ComponentKeyToken.FRAGMENT);
    return this;
  }
  idx(index: number) {
    this.append(`${index}`);
    return this;
  }
  separator() {
    this.append(ComponentKeyToken.SEPARATOR);
    return this;
  }
  tag(tagName: string) {
    this.append(tagName);
    return this;
  }
  toString(): string {
    return this.values.join(ComponentKeyToken.SEPARATOR);
  }
}
