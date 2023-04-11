type Singleton<T> = {
  get instance(): T;
};

export function toSingleton<T>(Constructor: new (...args: any[]) => T): Singleton<T> {
  const Ctor = Constructor as new (...args: any[]) => any;
  return class extends Ctor {
    protected constructor(...args: any[]) {
      super(...args);
    }
    private static _instance: typeof Ctor;

    static get instance() {
      if (!this._instance) {
        this._instance = new Ctor();
      }
      return this._instance;
    }
  } as unknown as Singleton<T>;
}
