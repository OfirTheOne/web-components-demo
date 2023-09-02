import { Ctor } from '../../models';

type Singleton<T> = {
  get instance(): T;
};

export function toSingleton<T>(ctor: Ctor<T>): Singleton<T> {
  const Ktor = ctor as new (...args: any[]) => any;
  return class extends Ktor {
    protected constructor(...args: any[]) {
      super(...args);
    }
    private static _instance: typeof Ktor;

    static get instance() {
      if (!this._instance) {
        this._instance = new Ktor();
      }
      return this._instance;
    }
  } as unknown as Singleton<T>;
}
