
export interface ProviderFn<T = any> {
    (props: { value: T }, children: any[]): any;
  }

export class InheritableContext<T = any> {
    constructor(protected contextSymbol: symbol, public defaultValue?: T) {}
    protected _provider: ProviderFn;
    set provider(value: ProviderFn) {
      this._provider = value;
    }
    protected _key: string;
    set key(value: string) {
      this.key = value;
    }
    protected _value: T;
    set value(value: T) {
      this.value = value;
    }
  }
  

  export interface Context<T = any> {
    Provider: ProviderFn<T>
  }
  