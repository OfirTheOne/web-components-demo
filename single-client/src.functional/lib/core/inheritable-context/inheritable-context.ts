export interface ProviderFn<T = any> {
  (props: { value?: T }, children: any[]): any;
}

export class InheritableContext<T = any> {
  constructor(protected contextSymbol: symbol, public defaultValue?: T) {}
  protected _provider: ProviderFn;
  set provider(value: ProviderFn) {
    this._provider = value;
  }
  protected _key: string;
  set key(value: string) {
    this._key = value;
  }
  get key() {
    return this._key;
  }

  protected _value: T;
  set value(val: T) {
    this._value = val;
  }
  get value() {
    return this._value || this.defaultValue;
  }
}

export interface Context<T = any> {
  Provider: ProviderFn<T>;
  contextSymbol: symbol;
}
