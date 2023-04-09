
export interface ProviderFn {
    (props: { value: any }, children: any[]): any;
  }

export class InheritableContext<T = any> {
    constructor(public defaultValue?: T) {}
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
  